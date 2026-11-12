"""The badge catalogue: one declarative entry per badge.

To add a badge that uses an existing rule `kind`, add one `Badge(...)` line
below and add its art, named <slug>.svg, to the frontend badge assets.
Nothing else changes: the list, header counter, detail view and awarding all
read this catalogue. A new kind of rule needs one method on `History` in
badges.py (returning sorted (time, reference) events) plus its tests.

Fields: slug (stable id, also the art file name, never reuse or rename once
shipped because awards are stored by slug), name, family (families show in
first-seen order), tier (1 achievable, 2 challenging, 3 rare), kind (the
History method), target (how many qualifying events earn it), explanation
(shown to the learner), and the kind's own parameters.
"""
from datetime import timedelta

WEEK = timedelta(days=7)
MONTH = timedelta(days=30)
TIERS = {1: "Achievable", 2: "Challenging", 3: "Rare"}


class Badge:
    def __init__(self, slug, name, family, tier, kind, target, explanation, **params):
        self.slug, self.name, self.family, self.tier = slug, name, family, tier
        self.kind, self.target, self.explanation, self.params = kind, target, explanation, params


BADGES = [
    Badge("first-sprout", "First sprout", "Reading", 1, "cards", 1, "Read your first card."),
    Badge("book-beetle", "Book beetle", "Reading", 1, "cards", 100, "Read 100 different cards."),
    Badge("wise-oak", "Wise oak", "Reading", 2, "cards", 300, "Read 300 different cards."),
    Badge("ancient-grove", "Ancient grove", "Reading", 3, "cards", 750, "Read 750 different cards."),
    Badge("evergreen-reader", "Evergreen reader", "Reading", 3, "cards", 1200, "Read 1,200 different cards."),
    Badge("slow-growth", "Slow growth", "Reading", 1, "weeks", 6, "Come back in 6 different calendar weeks (Monday to Sunday), reading a card or answering a question each time. The weeks need not be consecutive."),
    Badge("perennial", "Perennial", "Reading", 3, "weeks", 16, "Be active in 16 different calendar weeks. Gaps are fine; nothing resets."),
    Badge("first-flame", "First flame", "Streaks", 1, "streak", 7, "Read a card or answer a question correctly every day, 7 days in a row. Days are calendar days in Paris time."),
    Badge("steady-ember", "Steady ember", "Streaks", 1, "streak", 15, "Keep a daily streak going for 15 days in a row: a card read or a correct answer each day."),
    Badge("campfire", "Campfire", "Streaks", 2, "streak", 30, "A month without missing a day: a card read or a correct answer every day for 30 days in a row."),
    Badge("bonfire", "Bonfire", "Streaks", 2, "streak", 100, "Read a card or answer a question correctly every day for 100 days in a row."),
    Badge("wildfire", "Wildfire", "Streaks", 3, "streak", 150, "Read a card or answer a question correctly every day for 150 days in a row."),
    Badge("inferno", "Inferno", "Streaks", 3, "streak", 200, "Read a card or answer a question correctly every day for 200 days in a row."),
    Badge("eternal-flame", "Eternal flame", "Streaks", 3, "streak", 365, "A full year of daily gardening: a card read or a correct answer every day for 365 days in a row."),
    Badge("busy-bee", "Busy bee", "Answers", 1, "correct", 100, "Answer 100 different questions correctly."),
    Badge("word-weaver", "Word weaver", "Answers", 1, "correct", 50, "Correctly answer 50 different typed-answer questions.", typed=True),
    Badge("pick-of-the-patch", "Pick of the patch", "Answers", 2, "correct", 200, "Correctly answer 200 different multiple-choice questions.", typed=False),
    Badge("honey-harvest", "Honey harvest", "Answers", 2, "correct", 500, "Answer 500 different questions correctly."),
    Badge("silver-tongue", "Silver tongue", "Answers", 2, "correct", 150, "Correctly answer 150 different typed-answer questions.", typed=True),
    Badge("orchard-keeper", "Orchard keeper", "Answers", 3, "correct", 1200, "Answer 1,200 different questions correctly."),
    Badge("second-spring", "Second spring", "Comebacks", 1, "recovered", 5, "Get 5 different questions right after having got each one wrong."),
    Badge("mighty-mender", "Mighty mender", "Comebacks", 2, "recovered", 25, "Recover 25 different questions: wrong first, correct later."),
    Badge("unstoppable-snail", "Unstoppable snail", "Comebacks", 3, "recovered", 75, "Recover 75 different questions, with no time limit."),
    Badge("memory-moth", "Memory moth", "Comebacks", 2, "review", 25, "Correctly answer 25 different questions during review attempts."),
    Badge("deep-roots", "Deep roots", "Comebacks", 2, "gap", 10, "Answer 10 different questions correctly in a review at least 7 days after an earlier correct answer to the same question.", gap=WEEK),
    Badge("old-roots", "Old roots", "Comebacks", 3, "gap", 10, "Do the same after a gap of at least 30 days, for 10 different questions.", gap=MONTH),
    Badge("triple-bloom", "Triple bloom", "Comebacks", 3, "spaced", 5, "For 5 different questions, answer correctly on 3 separate occasions, each at least 7 days after the previous one."),
    Badge("branch-hopper", "Branch hopper", "Exploring", 1, "area", 3, "Read at least 10 cards in each of 3 different learning paths.", level="path", cards=10),
    Badge("trail-mix", "Trail mix", "Exploring", 2, "area", 6, "Read at least 10 cards in each of 6 different paths.", level="path", cards=10),
    Badge("cartographer", "Cartographer", "Exploring", 3, "area", 9, "Read at least 10 cards in each of 9 different paths.", level="path", cards=10),
    Badge("cross-pollinator", "Cross-pollinator", "Exploring", 1, "area", 2, "Read at least 20 cards in each of 2 different themes.", level="theme", cards=20),
    Badge("curious-fox", "Curious fox", "Exploring", 2, "area", 3, "Read at least 20 cards in each of 3 themes.", level="theme", cards=20),
    Badge("four-corners", "Four corners", "Exploring", 3, "area", 4, "Read at least 50 cards in each of 4 themes.", level="theme", cards=50),
    Badge("clean-patch", "Clean patch", "Finishing", 1, "lessons_done", 1, "Read every card in one lesson and answer every question in it correctly at least once. The lesson must have questions."),
    Badge("tidy-gardener", "Tidy gardener", "Finishing", 2, "lessons_done", 10, "Fully complete 10 different lessons by the Clean patch rule."),
    Badge("cover-to-cover", "Cover to cover", "Finishing", 2, "lessons_read", 25, "Read every card in 25 different lessons. Questions are not required."),
    Badge("full-flower", "Full flower", "Finishing", 2, "paths_read", 1, "Read every card in one whole path. Questions are not required."),
    Badge("straight-arrow", "Straight arrow", "Finishing", 3, "first_try", 1, "In one lesson with at least 8 questions, read every card and get every question right on your very first attempt at it."),
    Badge("garden-keeper", "Garden keeper", "Finishing", 3, "paths_done", 1, "Read every card in one path and answer all of its questions correctly at least once."),
    Badge("little-greenhouse", "Little greenhouse", "Finishing", 3, "paths_done", 3, "Fully complete 3 different paths by the Garden keeper rule."),
    Badge("theme-master", "Theme master", "Finishing", 3, "themes_done", 1, "Fully complete every path of a theme that has 2 or more paths."),
    Badge("worthy-rival", "Worthy rival", "Challenge", 2, "challenge_wins", 10, "Win the weekly Challenge 10 times. A win means finishing ahead of the other player with at least 3 correct answers; ties don't count."),
    Badge("duel-veteran", "Duel veteran", "Challenge", 2, "challenge_wins", 20, "Win the weekly Challenge 20 times. A win means finishing ahead of the other player with at least 3 correct answers; ties don't count."),
    Badge("challenge-champion", "Challenge champion", "Challenge", 3, "challenge_wins", 30, "Win the weekly Challenge 30 times. A win means finishing ahead of the other player with at least 3 correct answers; ties don't count."),
    Badge("grand-duelist", "Grand duelist", "Challenge", 3, "challenge_wins", 50, "Win the weekly Challenge 50 times. A win means finishing ahead of the other player with at least 3 correct answers; ties don't count."),
    Badge("living-legend", "Living legend", "Challenge", 3, "challenge_wins", 100, "Win the weekly Challenge 100 times. A win means finishing ahead of the other player with at least 3 correct answers; ties don't count."),
]
BY_SLUG = {badge.slug: badge for badge in BADGES}
