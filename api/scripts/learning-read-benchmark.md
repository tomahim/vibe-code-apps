# Little Grains DB-read benchmark

Baseline: `2d200387`. Synthetic local SQLite fixture: 4 themes, 8 paths, 40 lessons, 400 cards, 400 questions, 399 card reads and 400 attempts. Cards have 2.4 KB repeated text; questions have repeated prompt/explanation text and two choices. This is not a production workload or sizing model.

Run from `api/`: `python scripts/benchmark_learning_reads.py` using the development requirements. The script refuses DATABASE_URL and non-SQLite connections, creates an isolated test database and tears it down. Run the same script on each revision.

Each GET is captured, then its SELECTs are replayed against the unchanged fixture. Bytes are the UTF-8 lengths of non-null returned cell values (via str), excluding protocol framing, type metadata, TLS, compression and null representation. They are a local logical result-size measure, not measured Neon billed transfer.

| GET | SELECTs before/after | Rows before/after | Logical cell bytes before/after | Reduction |
| --- | ---: | ---: | ---: | ---: |
| themes | 8 / 8 | 1,652 / 1,652 | 1,931,100 / 116,300 | 94.0% |
| theme | 8 / 8 | 1,643 / 413 | 1,924,225 / 27,675 | 98.6% |
| path | 7 / 7 | 1,606 / 206 | 1,919,462 / 13,907 | 99.3% |
| lesson | 6 / 7 | 1,601 / 51 | 1,918,934 / 39,349 | 97.9% |
| garden | 16 / 16 | 3,300 / 3,300 | 2,021,811 / 207,011 | 89.8% |
| practice | 7 / 8 | 1,606 / 216 | 1,919,363 / 24,482 | 98.7% |
| review | 6 / 7 | 1,640 / 1,650 | 1,933,520 / 129,390 | 93.3% |

All seven API responses were byte-for-byte identical (SHA-256 compared), with seeded quiz selection and a fixed clock. A single extra SELECT on reader/practice/review batches only the chosen public question text instead of fetching every prompt, option and answer key before selection. Summary query count is unchanged.

Garden and other library-wide summaries still read lightweight metadata/history across visible content. This change does not eliminate all library-wide reads or bound accumulated attempt history. It removes heavy content from them. No cache, schema, migration, hosting, importer or challenge rule changes are included.

The 5.76 GB historical transfer incident cannot be allocated to these requests from this benchmark. No production database query was used, and these percentages must not be presented as production billing savings. The blocked Neon quota still requires separate recovery.
