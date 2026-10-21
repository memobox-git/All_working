"""Writes word timings for the voice, in the same shape as an ElevenLabs
transcript, so ../../kit/make-cues.js can turn it into cues.js. Usage:
  python3 -I transcribe.py <voice.wav> <transcript.json>
The effect names go in as a hint, so Whisper spells them the way the edit looks for them."""
import json, subprocess, sys
import numpy as np
from faster_whisper import WhisperModel

HINT = ('Claude, edit this video and add these effects. Orbit. Chat takeover. Frame escape. Snap zoom. '
        'Checklist pop. Headline storm. Zoom portal. Growth curve. Studio reveal. B-roll overlay. Paper cutout. '
        'Dolly zoom. Magazine cover. Liquid glass. Zoom-through cut. Green screen. Frame break. Digital zoom. '
        'Phone mockup. Checklist.')

src, out = sys.argv[1], sys.argv[2]
# decoded with ffmpeg, as 16 kHz mono floats, which is what Whisper wants
pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-f', 's16le', '-ac', '1', '-ar', '16000', '-'], capture_output=True, check=True).stdout
audio = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768
model = WhisperModel('small.en', device='cpu', compute_type='int8')
segments, _ = model.transcribe(audio, language='en', word_timestamps=True, initial_prompt=HINT, beam_size=5)
words = [{'text': w.word.strip(), 'type': 'word', 'start': w.start, 'end': w.end}
         for s in segments for w in s.words if w.word.strip()]

# Whisper can place a word that follows a pause half a second early or late, and
# effects switch on these times. So the first word of each stretch of speech starts
# where the voice comes back, and an end inside a pause moves to where it stopped.
hop = 0.02
db = 20 * np.log10(np.sqrt(np.square(audio[:len(audio) // 320 * 320].reshape(-1, 320)).mean(1)) + 1e-9)
quiet, pauses, run = db < -35, [], None
for i, q in enumerate(list(quiet) + [False]):
    if q and run is None: run = i
    if not q and run is not None:
        if (i - run) * hop >= 0.25: pauses.append((run * hop, i * hop))
        run = None
speech = [(b, c) for (_, b), (c, _) in zip([(0, 0)] + pauses, pauses + [(len(audio) / 16000, 0)]) if c > b]
for a, b in speech:
    first = next((w for w in words if w['end'] > a - 0.05), None)
    if first and first['start'] < b: first['start'] = a
for w in words:
    for a, b in pauses:
        if a - 0.05 <= w['start'] < b: w['start'] = b
        if a < w['end'] <= b + 0.05: w['end'] = max(a, w['start'] + 0.1)
for w, nxt in zip(words, words[1:]):  # two words given the same start
    if nxt['start'] <= w['start']: nxt['start'] = min(w['start'] + 0.2, nxt['end'] - 0.05)
for w in words:
    w['start'], w['end'] = round(w['start'], 3), round(max(w['end'], w['start'] + 0.05), 3)
json.dump({'text': ' '.join(w['text'] for w in words), 'words': words}, open(out, 'w'), indent=1)
print(f'{len(words)} words, {words[-1]["end"] if words else 0}s')
