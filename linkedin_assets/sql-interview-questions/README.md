# SQL interview questions: answers and traps

Six chalkboard JPEGs (2160 × 2700, 4:5) for a multi-image LinkedIn post, plus the post text in `post.txt`. There are 8 common SQL interview questions, each with a working query and the trap that breaks the obvious answer. Slide order: intro, questions 1–2, 3–4, 5–6, 7–8, closing line.

Every query was run against sample data in SQLite 3.45 before publishing. That run confirmed the DENSE_RANK tie result, the NULLIF divide-by-zero guard, the NULL-in-CASE trap, the join counts (INNER 6, LEFT 7, RIGHT 7, FULL 8, CROSS 20) and the COUNT(*) vs COUNT(e.emp_id) difference.

To edit, change `source/sql.html` and render from `source/` with `PAGE=sql.html ./render2.sh "?slide=N" out.png 2` (needs Chromium). Slides run from 0 (intro) to 5 (closing).
