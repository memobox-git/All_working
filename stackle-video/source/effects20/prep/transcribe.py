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
words = [{'text': w.word.strip(), 'type': 'word', 'start': round(w.start, 3), 'end': round(w.end, 3)}
         for s in segments for w in s.words if w.word.strip()]
json.dump({'text': ' '.join(w['text'] for w in words), 'words': words}, open(out, 'w'), indent=1)
print(f'{len(words)} words, {words[-1]["end"] if words else 0}s')
