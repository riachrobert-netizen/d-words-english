# Word Club

A single browser app for the A + B and D word sets. The root `index.html` link still opens D, and `a-b-words.html` still opens A + B. Both send students to `word-club/index.html` with a category query parameter. The civilization game is independent.

## Playing

- Enter a player name on each device. A device can keep several separate player profiles.
- Choose A + B or D; each has four original rounds.
- Quick practice offers 5, 10 or 15 mixed questions.
- Mistake review draws questions answered incorrectly. A correct retry removes them from that queue.
- Time Challenge uses ten questions and five minutes, with accuracy then elapsed time determining the personal best. It has the same question set each week per category, in a randomized order. Weeks begin Monday in China time. Its timer continues across reloads and backgrounding.
- Results are saved locally in that browser. Students can save a result image or copy the result text. The results history exports as a CSV for the selected profile. There is no online shared leaderboard.

Browser storage belongs to a particular browser on a particular device. Clearing site data clears profiles and scores. The first visit also imports compatible saved rounds from the earlier `ab-word-club-v1` and `d-word-club-v1` storage keys, when opened on the same GitHub Pages origin.

## Adding a category

`assets/words.js` contains the category bank keyed by a short ID. Each category has `id`, `label`, `words` and `rounds`. Every round has `words` and `questions`. Question IDs must be unique within the category. The common engine in `assets/app.js` reads any category in that bank, creates the home tile, practice sessions, review, and weekly challenge, then saves results under the category ID. Include at least four fill-in questions, three spelling questions and three sentence builders for a ten-question challenge. Add a redirect page if an old category link must be retained.

Question types: `tiles` (sentence builder), `spell`, `blank`, `choice`, `chat`, `match`. Multiple-choice questions must include the `answer` in `choices`. `blank` also needs its `answer` in `sentence`. `match` uses English/Chinese `pairs`. Words are arrays: English word, Chinese meaning, sample sentence, Chinese translation, tested form.

All files are local HTML, CSS and JavaScript. There are no external fonts, images, libraries or score services.
