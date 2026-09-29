# Word Club

A mobile friendly browser app with individual A, B, C, D and E categories. Each has rounds, quick practice, mistake review and a weekly five minute challenge. The original A+B bank stays hidden so past scores and sessions still load. The old `a-b-words.html` link opens A; the old root `index.html` opens D. Separate `a-words.html` through `e-words.html` links open each category directly.

## Source vocabulary

- A and B: the original A+B words, split without changing meanings or example sentences.
- C: all 32 target words and their example sentences from `c words sentences only input.docx` (19 September 2026). Chinese translations and practice questions were added. British spellings `centre` and `colour` are retained.
- D: the original 20 word, four round category, unchanged.
- E: an editable **starter set** of 20 words with examples, since no teacher supplied E list was found. Replace these when the class vocabulary is available.

## Playing and saved scores

Enter a player name on each device. A device can hold several local profiles. A category has its own rounds, quick practice, mistake review and time challenge. Time Challenge chooses ten questions per category for each China time week; the five minute timer continues across reloads. Results can be saved as a picture, copied, or exported as CSV. There is no shared online leaderboard. Clearing browser site data erases local results.

Older `word-club-v2` profiles and results remain accessible. Previous A+B results still appear in history as A+B; new results go into A or B. The first visit can also import compatible old `ab-word-club-v1` and `d-word-club-v1` rounds from the same origin.

## Adding another letter

`assets/words.js` is the category bank. Each visible category has `id` (lowercase letter), `label` (uppercase letter), `words`, and `rounds`. Each round has `words` and `questions`. Question IDs must be unique within a category. Each word row is `[English, Chinese meaning, English sentence, Chinese sentence, tested form]`. The common engine generates the category tile and modes from this data automatically. For ten question challenges, supply at least four `blank`, three `spell` and three `tiles` questions across rounds.

`tools/expand-bank.cjs` holds the editable C and E sources and the A/B split generator. Run `node word-club/tools/expand-bank.cjs` from the repo root after editing those lists. To add F and later categories, define its source rows, call `makeCategory('f', rows)`, and include it in `ordered`. Provide a simple root redirect page if a direct link is useful. Question types are `tiles`, `spell`, `blank`, `choice`, `chat` and `match`.

The app uses local HTML, CSS and JavaScript without external fonts, images, libraries or score services.
