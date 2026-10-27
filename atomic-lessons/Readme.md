# Atomic lessons authoring guide

This folder is the canonical source for learning content. Themes contain learning paths, paths contain lessons, and each lesson owns cards and questions. Content is authored here and can later be imported into Neon; this PR does not implement that importer.

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

Every learning path's `index.md` must have an `image` filename and useful `image_alt` text. The image file must sit directly beside that index, for example:

```yaml
image: cover.png
image_alt: A caregiver sharing a picture book with a baby.
```

Use PNG, JPEG, WebP, GIF, or SVG. Commit the image alongside the index; URLs, parent paths, nested asset paths, and links outside the learning path folder are not accepted. Other content elements may use optional repository-local images with alt text.

Cards use the same front matter. Use positive sibling positions, unique within the parent. Gaps are allowed. Cards and questions have separate position sequences. If a filename has a numeric prefix, keep it aligned with `position`.

For expression lessons, put exactly four expression pairs in each card. Write the English in bold followed by its French translation as an italic blockquote. Keep translations precise and American English natural:

```markdown
**Good morning, sweetheart.**

> *Bonjour mon cœur.*
```

Use at most six cards per lesson. Keep card counts even so a question follows each pair. Split an oversized subject into another lesson. A translation pair is one expression, even when its English contains two short sentences.

## Lesson questions

Keep questions as YAML files in the lesson's `questions/` folder. They belong to the lesson, not to an individual card. Each question has its own `id`, sibling `position`, `type: multiple_choice`, `after_card_position`, `prompt`, four `choices` (each with `id` and `text`), one `correct_choice_ids` reference, `explanation`, and `archived`.

For the current path, author three alternative questions for each checkpoint after cards 2 and 4, and after card 6 when present. This gives six questions for a four-card lesson and nine for a six-card lesson. Questions sharing `after_card_position` form a pool: choose one question from that pool for a checkpoint. Keep `position` unique within the lesson; `after_card_position` may repeat. `after_card_position` expresses that placement while the question remains a lesson child. Use a phrase taught in the preceding pair. Give a French meaning cue and an English sentence with `____` for the missing part. The French cue must make the intended meaning unambiguous. Distractors should be close conjugations, particles, or related words with different meanings; avoid unrelated filler or multiple valid answers. Explain the correct form and the relevant contrasts. Store question content directly; there are no revisions.

## Validation before committing

Install `PyYAML==6.0.2`, then run from the repository root:

```sh
python atomic-lessons/check_uuids.py
python atomic-lessons/check_images.py
python -m unittest discover -s atomic-lessons -p 'test_*.py'
```

The UUID check scans the entire library, requires IDs on all content elements and choices, and rejects malformed UUIDs, non-v4 UUIDs, duplicate declarations, missing index files, and duplicate YAML keys. Correct-answer references must resolve to choices in the same question. The image check requires an existing sibling image and alt text for every learning path, checks the image header, and rejects paths outside that folder. CI runs these checks on pull requests and pushes affecting this folder or its workflow.

## Early Childhood English inventory and provenance

The Language theme's first path contains 18 lessons, 94 cards, 141 questions, and 376 expression pairs. All 318 rows from the workbook's `Phrases du quotidien` sheet are preserved once. Supporting examples from `Verbes utiles` and `Structures clés`, plus explicitly recorded authored variants, complete the cards. `source-map.csv` records the origin of every expression, including workbook sheet/row or an adaptation note. Keep that map current when editing this path.

Source workbook: `Anglais_americain_avec_bebe.xlsx` (SHA-256 `b40b2466b417c4cbfd29b31ca0ec23b1882a980573996d35a47237aa667f4a88`). It is source material only and is not committed here. The translations and expressions are for adult language practice.

| Lesson | Cards | Questions |
| --- | ---: | ---: |
| 1. [Morning greetings and reconnecting](themes/language/early-childhood-english/morning-greetings/index.md) | 4 | 6 |
| 2. [Noticing and commenting on your baby](themes/language/early-childhood-english/noticing-your-baby/index.md) | 6 | 9 |
| 3. [Holding and carrying your baby](themes/language/early-childhood-english/holding-and-carrying/index.md) | 4 | 6 |
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
