# Music

Stackle's own background music. Every note is written in `compose.py` and every sound is synthesised there from plain waveforms: no samples, loops, presets or stock music from anywhere else. So the tracks are ours, free to use in any video on any platform, with no licence or Content ID claims.

| Track | Mood | Tempo, key | Loop | Use it under |
|---|---|---|---|---|
| `rise` | Inspiring | 92 BPM, D major | 2:05 | The Plan (start-over roadmaps), story videos, intros and calls to action. Piano alone, then strings, then a big chorus with the hook. |
| `momentum` | Fast | 128 BPM, F minor | 1:30 | Shorts, montages, quick tips, effect showcases. Full speed from the first second. |
| `still` | Very slow | 60 BPM, C major | 2:08 | Across the Table, hard truths, emotional moments in a story. No drums. |
| `focus` | Lo-fi, calm | 84 BPM, F major | 2:17 | The Free Course, Explained for Data Engineers, screen-recorded builds. Made to sit under hours of talking. |
| `pulse` | Curious | 100 BPM, A minor | 1:55 | Real Interview (round by round), "why you keep getting rejected", system design walkthroughs. |

Every track is a **seamless loop**: the last bar runs straight back into the first, so it can sit under a video of any length. Set the editor (CapCut, Descript, Premiere) to loop the clip and fade it out at the end. Each starts quietly enough to fade in under a voice.

All five are mastered to -14 LUFS, the level YouTube plays at, so they can be swapped for each other without changing the volume. Under a voice, set the music about 18–22 dB below the voice and duck it while you talk; `../kit/mix.js` already does both for the bed.

## Make them

```bash
python3 -I compose.py            # all five, about 2 minutes each
python3 -I compose.py rise       # just one
```

Writes `tracks/<name>.mp3` (192 kbps, committed) and `tracks/<name>.wav` (16-bit, 48 kHz, for editing; not committed). Python needs `numpy` and `ffmpeg` on the path. The output is the same every run: each track has a fixed random seed.

## Changing a track

Each track is one function in `compose.py` (`rise`, `momentum`, `still`, `focus`, `pulse`). At the top of each are the chords, the tunes as `(beat, note, beats)` with MIDI note numbers (60 is middle C), and then the arrangement bar by bar. The mix is at the bottom: each stem's level in dB and how much of it goes to the reverb.

- **Tempo:** the first argument of `Song(...)`.
- **Length:** the second argument (bars). The arrangement uses bar numbers, so change both together.
- **A new variation:** copy a function, change the seed (third argument of `Song`), the chords or the tune, and add it to `TRACKS`.
