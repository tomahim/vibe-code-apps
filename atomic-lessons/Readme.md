# Atomic lessons authoring guide

This folder is the canonical source for learning content. Themes contain learning paths, paths contain lessons, and each lesson owns cards and questions. Content is authored here and synchronized into the Neon database: every merge to `master` that changes this folder runs the `Sync atomic lessons to the database` workflow, which upserts the library into the `lg_` tables via `api/apps/learning/management/commands/sync_atomic_lessons.py` (one SyncLog row per commit, nothing is ever deleted - retiring content uses `archived: true`). The workflow authenticates with the repository's `DATABASE_URL` Actions secret.

## Folder structure

```text
atomic-lessons/
  library.yaml
  themes/
    language/
      index.md
      early-childhood-english/
        index.md
        cover.png                         # required learning-path illustration
        morning-greetings/
          index.md
          cards/
            01_expressions.md
            02_expressions.md
          questions/
            01_complete-the-sentence.yaml
          assets/                         # optional, lesson-local files
```

`library.yaml` declares `schema_version`. Use readable folder/file names without UUIDs. Folder nesting supplies parent relationships; do not add a second editable parent ID to the content. `position` in metadata supplies ordering, never filesystem order.

## Identity and editing

Every theme, learning path, lesson, card, question, and answer choice needs a unique canonical lowercase UUIDv4 in an `id` field. Generate a fresh UUID once when authoring an element. Keep it when correcting, renaming, moving, or reordering that element. When duplicating content, generate new UUIDs for the entire duplicated subtree, including answer choices. Never derive IDs from names, paths, or positions, and never regenerate IDs during import.

IDs are declared only in YAML metadata. Fields such as `correct_choice_ids` are references to existing choice IDs and may repeat those references. If retiring content, keep its ID and content file with `archived: true`; never recycle that ID for another concept. Retiring a parent makes its children unavailable too.

## Index files and cards

Use `index.md` for every theme, learning path, and lesson. Put YAML front matter at the very top, followed by an optional Markdown introduction:

```yaml
---
id: <fresh-uuid-v4>
position: 1
title: A short, descriptive title
description: What the learner will learn.
archived: false
---
```

Learning paths and lessons carry no images: illustrations belong to individual cards (#195). A card's Markdown file may declare an optional sibling image, for example:

```yaml
image: blue-hole.png
image_alt: Divers floating over the deep blue sinkhole of the Blue Hole.
image_caption: The Great Blue Hole drops straight into darkness.
image_credit: U.S. Geological Survey
image_license: CC BY 4.0
image_source_url: https://commons.wikimedia.org/wiki/File:Great_Blue_Hole.jpg
```

Commit the image beside the card file; URLs, parent paths, nested asset paths, and links outside the card folder are not accepted. Use an optimized PNG, JPEG or WebP source: at most 400 KB and 1600 px wide, because the sync decodes it and publishes 640 and 1280 px WebP variants to the media bucket. `image_alt` is required and describes the picture to someone who cannot see it. `image_credit` and `image_license` are required for photos and other reused material so the app can attribute them; your own artwork uses `image_license: original` and needs no credit. `image_caption` and `image_source_url` are optional. Replacing the file re-publishes the variants; an unchanged file is not processed again.

Cards use the same front matter. Use positive sibling positions, unique within the parent. Gaps are allowed. Cards and questions have separate position sequences. If a filename has a numeric prefix, keep it aligned with `position`.

For concept lessons, use 6–10 cards including a final **3 key learnings** card. Keep each concept card at least 100 words long in two or three paragraphs. Explain the mechanism with a concrete example when relevant; avoid cards made only of definitions or broad claims. Add a source or optional deeper-reading link directly to selected cards. Author six multiple-choice questions per lesson as two pools of three alternatives: one checkpoint midway through the teaching cards and one after the recap, so the learner answers exactly two.

For expression lessons, put exactly four expression pairs in each card. Write the English in bold followed by its French translation as an italic blockquote. Keep translations precise and American English natural:

```markdown
**Good morning, sweetheart.**

> *Bonjour mon cœur.*
```

For expression lessons, use at most six cards. Keep card counts even so a question follows each pair. Split an oversized subject into another lesson. A translation pair is one expression, even when its English contains two short sentences.

## Lesson questions

Keep questions as YAML files in the lesson's `questions/` folder. They belong to the lesson, not to an individual card. Each question has its own `id`, sibling `position`, `type`, `after_card_position`, `prompt`, `explanation`, and `archived`. A `multiple_choice` question has four `choices` (each with `id` and `text`) and one `correct_choice_ids` reference.

A `type_answer_question` can ask for any typed response. It has `accepted_answers` instead of choices or `correct_choice_ids`; the first answer is the canonical feedback answer, and later entries are valid authored alternatives. Keep each answer under 256 characters. The server compares after normalizing case, punctuation, apostrophes, and spacing. Typos and unlisted paraphrases count as wrong and show the canonical answer. This keeps grading predictable for short answers where a one-letter change can change meaning. For lessons with both types at a checkpoint, multiple choice is used until the whole lesson is complete; later reviews use typed questions. Author at least two typed alternatives at each such checkpoint so a wrong answer can move to another question.

For example, an English translation question in `questions/08_translate.yaml` has this shape:

```yaml
id: 0bd5df4e-408f-4c47-95f7-83820cfaead7
position: 8
type: type_answer_question
after_card_position: 2
prompt: "Traduisez en anglais : « Je suis tellement contente de te voir. »"
accepted_answers:
  - "I'm so happy to see you."
  - "I am so happy to see you."
explanation: "La phrase du cours est « I'm so happy to see you. ». Comparez le sens et la structure de votre réponse."
archived: false
```

For the current path, author three alternative multiple-choice questions for each checkpoint after cards 2 and 4, and after card 6 when present. Questions sharing `after_card_position` form a pool: choose one question from the preferred type's pool for a checkpoint. Keep `position` unique within the lesson; `after_card_position` may repeat. `after_card_position` expresses that placement while the question remains a lesson child. Use a phrase taught in the preceding pair. For multiple-choice questions, give a French meaning cue and an English sentence with `____` for the missing part. The French cue must make the intended meaning unambiguous. Distractors should be close conjugations, particles, or related words with different meanings; avoid unrelated filler or multiple valid answers. Explain the correct form and the relevant contrasts. Store question content directly; there are no revisions.

## Validation before committing

Install `PyYAML==6.0.2`, then run from the repository root:

```sh
python atomic-lessons/check_uuids.py
python atomic-lessons/check_images.py
python -m unittest discover -s atomic-lessons -p 'test_*.py'
```

The UUID check scans the entire library, requires IDs on all content elements and choices, and rejects malformed UUIDs, non-v4 UUIDs, duplicate declarations, missing index files, and duplicate YAML keys. Correct-answer references must resolve to choices in the same question. The image check validates every card illustration that is declared: the sibling image must exist as an optimized PNG, JPEG or WebP (400 KB, 1600 px), its header must match its extension, alt text is required, credit and license are required unless the license is `original`, and paths outside the card folder are rejected. The retirement check (`check_retired_ids.py`) compares the branch against its base revision and rejects any content ID that disappeared or changed kind: retire content with `archived: true`, never by deleting its file or recycling its ID. Moving or renaming a file is fine while its ID survives. CI runs these checks on pull requests and pushes affecting this folder or its workflow.

## Early Childhood English inventory and provenance

The Language theme's first path contains 18 lessons, 94 cards, 155 questions, and 376 expression pairs. All 318 rows from the workbook's `Phrases du quotidien` sheet are preserved once. Supporting examples from `Verbes utiles` and `Structures clés`, plus explicitly recorded authored variants, complete the cards. `source-map.csv` records the origin of every expression, including workbook sheet/row or an adaptation note. Keep that map current when editing this path.

Source workbook: `Anglais_americain_avec_bebe.xlsx` (SHA-256 `b40b2466b417c4cbfd29b31ca0ec23b1882a980573996d35a47237aa667f4a88`). It is source material only and is not committed here. The translations and expressions are for adult language practice.

| Lesson | Cards | Questions |
| --- | ---: | ---: |
| 1. [Morning greetings and reconnecting](themes/language/early-childhood-english/morning-greetings/index.md) | 4 | 10 |
| 2. [Noticing and commenting on your baby](themes/language/early-childhood-english/noticing-your-baby/index.md) | 6 | 15 |
| 3. [Holding and carrying your baby](themes/language/early-childhood-english/holding-and-carrying/index.md) | 4 | 10 |
| 4. [Comforting a crying baby](themes/language/early-childhood-english/comforting-a-crying-baby/index.md) | 6 | 9 |
| 5. [Affection and encouragement](themes/language/early-childhood-english/affection-and-encouragement/index.md) | 6 | 9 |
| 6. [Feeding, bottles, and milk](themes/language/early-childhood-english/feeding-and-bottles/index.md) | 6 | 9 |
| 7. [Changing diapers](themes/language/early-childhood-english/changing-diapers/index.md) | 6 | 9 |
| 8. [Getting dressed](themes/language/early-childhood-english/getting-dressed/index.md) | 6 | 9 |
| 9. [Bath time and care](themes/language/early-childhood-english/bath-time-and-care/index.md) | 6 | 9 |
| 10. [Tummy time and movement](themes/language/early-childhood-english/tummy-time-and-movement/index.md) | 6 | 9 |
| 11. [Toys, books, and objects](themes/language/early-childhood-english/toys-books-and-objects/index.md) | 6 | 9 |
| 12. [Exploring the home](themes/language/early-childhood-english/exploring-the-home/index.md) | 4 | 6 |
| 13. [Narrating household actions](themes/language/early-childhood-english/narrating-household-actions/index.md) | 4 | 6 |
| 14. [Narrating routines and transitions](themes/language/early-childhood-english/routines-and-transitions/index.md) | 4 | 6 |
| 15. [Weather and nature](themes/language/early-childhood-english/weather-and-nature/index.md) | 4 | 6 |
| 16. [Going for a walk](themes/language/early-childhood-english/going-for-a-walk/index.md) | 6 | 9 |
| 17. [Car rides and travel](themes/language/early-childhood-english/car-rides-and-travel/index.md) | 4 | 6 |
| 18. [Sleep cues and settling](themes/language/early-childhood-english/sleep-cues-and-settling/index.md) | 6 | 9 |


## Tech & AI: How ChatGPT works

The [How ChatGPT works](themes/tech-and-ai/how-chatgpt-works/index.md) path adapts
[Stephen Wolfram's 2023 essay](https://writings.stephenwolfram.com/2023/02/what-is-chatgpt-doing-and-why-does-it-work/)
into 20 concept lessons. Each lesson has six teaching cards and a final **3 key learnings** recap card.
Each also has six questions in two pools of three: one question is selected after card 3 and one after
card 7. Selected cards include optional deeper-reading links.

The essay's GPT-2 and GPT-3 dimensions are historical examples, not current ChatGPT specifications.
Wolfram's ideas about semantic laws and computational irreducibility are presented as his
interpretations or open questions, not established descriptions of every language model.

## Language: 600 words for little english talkers

The [vocabulary path](themes/language/600-words-for-little-english-talkers/index.md) follows the 21 workbook categories, one lesson per category. Each category has 30 distinct workbook items across eight cards of four entries. The final card revisits two earlier entries to fill its four slots. Workbook animal sound sentences remain with their animal word, including sounds under Sea Life and Insects & Bugs. **Space questions every two cards:** each lesson has 16 typed-answer questions in four pools of four, after cards 2, 4, 6, and 8. The learner answers one question from each pool, for four questions per lesson.

The uncommitted source workbook is `English_French_Vocabulary_With_Sound_Rows-v2.xlsx` (SHA-256 `bdc9b651c24fbe524fce5e3918114a365983480827c40e1422c7fdc98c72cb52`). [source-map.csv](themes/language/600-words-for-little-english-talkers/source-map.csv) records the original workbook row, category, item number, word or sound, and lesson/card location for all 671 data rows. The path title says “600 words”; the supplied workbook actually contains 630 vocabulary entries and 41 additional sound sentences.

Card translations clarify the workbook's ambiguous “Biscuit” (American savory biscuit versus sweet cookie) and generic “Nut” (fruit à coque). Animal sentences use “gronde” for the bear and “aboie” for the seal; they remove the workbook's incorrect “meugle” alternatives. The source map retains the workbook's original wording for provenance.

## Sport: Hockey all time legends

The [Hockey all time legends](themes/sport/hockey-all-time-legends/index.md) path has 16 lessons covering players, coaches and legendary team results: Gretzky, Howe, Lemieux, Orr, Richard, Hull, Béliveau, Messier, Jagr, Ovechkin and Crosby, Roy and Hasek, Tretiak, Wickenheiser, the 1980 Miracle on Ice, the 1972 Summit Series, and Scotty Bowman with other coaching legends.

Each lesson has seven teaching cards plus a **3 key learnings** card (8 cards) and 16 questions in four pools of four, after cards 2, 4, 6 and 8. Per lesson, 12 questions are multiple choice and 4 are typed (25%). Pools after cards 4 and 8 mix two multiple-choice and two typed questions; pools after cards 2 and 6 are all multiple choice. Questions vary between era, team, achievement and record. Facts come from the Hockey Hall of Fame, NHL.com's 100 Greatest Players, NHL Records, IIHF, Olympics.com, Britannica Kids and BBC Sport; each lesson's last teaching card links a main source. Verify new facts against those kinds of sources before editing.
