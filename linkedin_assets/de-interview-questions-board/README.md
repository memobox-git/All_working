# Data engineer interview questions board

This is a chalkboard-style LinkedIn image with 12 data engineering interview questions and short answers, aimed at engineers with 4–7 years of experience. It is an original Stackle version of the format, not a copy of another creator's board.

- `de-interview-questions.png`: the still image, 2160 × 2700 (4:5, sharp on zoom).
- `de-interview-questions.jpg`: the same image, smaller file.
- `de-interview-questions.gif`: animated slides with large text that stays readable on a phone. An intro, then 4 slides of 3 questions that fill in one question at a time, then a closing line (about 38 seconds, loops).
- `de-interview-questions.mp4`: the same animation as a video.

To edit the text, change `source/board.html` (still image) or `source/slides.html` (animation), then run the scripts from `source/` (they need Chromium):

- Still image: `./render.sh "" out.png 2`.
- Animation frames: `PAGE=slides.html ./render2.sh "?slide=N&step=M" frame.png 1`. Use slide 0 for the intro, 1–4 for the questions (step 1–3) and 5 for the outro.
