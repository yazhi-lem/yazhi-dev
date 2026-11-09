# Contributor PR triage — 2026-11-09

> Facts only, each with the evidence needed to act. Regenerate with `gh pr list`
> before quoting numbers; this is a snapshot.

## 1. The situation

The public repos promise a **48-hour first review**
(`CONTRIBUTING.md`, yazhi-dev `factory/CURRENT.md`). Eight contributions from
outside the org are waiting:

| Repo | PR | Age | Author | State | Size |
|---|---|---:|---|---|---|
| `yazh-unity` | #7 CPU fallback for AI inference | **102 d** | ParthibanS2810 | CONFLICTING | +60/−4, 3 files |
| `yazhi-skills` | #9 skill-verification-testing | **50 d** | parottaaah | CONFLICTING | +185/−27, 91 files |
| `adhan` | #53 Colab/PyTorch scaffold | **46 d** | ParthibanS2810 | mergeable, **lint fails** | +391, 1 file |
| `open-sangam` | #90 Kalithogai headings + poets | **41 d** | Tyson-444 | mergeable, CLEAN | +3057/−1759, 100 files |
| `open-sangam` | #93 Purananuru headings + poets | **39 d** | Tyson-444 | mergeable, CLEAN | +1601/−801, 100 files |
| `yazhi-dev` | #31 mandala/showcase overhaul | **35 d** | ParthibanS2810 | CONFLICTING | +30305/−25670, 100 files |
| `adhan` | #100 Swaram vocab sweep | 12 d | ParthibanS2810 | **mergeable, 8/8 checks pass** | +154, 2 files |
| `open-sangam` | #146 Tamil-only headings | 5 d | Tyson-444 | CONFLICTING | +210/−84, 36 files |

Two different people — `ParthibanS2810` and `Tyson-444` — are both repeat
contributors. Neither has had a review.

**Why this matters more than any single feature:** the Q4 community goal is 20
external contributors and 30 merged external contributions by 31 Dec. The funnel
currently leaks at exactly the moment good work arrives.

## 2. Decision per PR

Nothing here is merged. Each row is a decision for the reviewer, with the reason.

### Merge now — green and small

- **`adhan#100` Swaram vocab-size sweep.** All 8 checks pass, +154 lines in 2 files,
  docs-only. Review the numbers (1k–12k vocab, with/without byte fallback) against
  `docs/reports/ab_swaram_vs_bpe.md`, then merge and **thank the author**. This is the
  cheapest possible signal that the repo is alive.

### Review and fix — near-miss

- **`adhan#53` Colab/PyTorch scaffold.** Tests pass; **`lint` fails** (18 s job). Ask the
  author to run `black`/`isort`, or land it behind a lint fix. Note it adds a
  `notebooks/` workspace only, no model code.

### Needs a decision on scope — clean but huge

- **`open-sangam#90` and `#93`.** Both merge cleanly per GitHub, but each touches
  **100 files** with thousands of lines changed. That size means the diff contains
  corpus data churn, not just headings. Review the *data* diff separately from the
  *code* diff before merging; if the corpus regeneration is incidental, ask the author
  to split. Do not rubber-stamp on "mergeable".

### Route to the owner — conflicting

- **`yazh-unity#7`** (102 d, CPU fallback) — highest goodwill value, and it conflicts.
  The contributor is fixing a real gap: the model path assumes a GPU backend. Ask for a
  rebase; the file is small (3 files, 64 lines) so a rebase is cheap for them.
- **`yazhi-skills#9`** (50 d) — 91 files for a skill addition means it likely
  regenerated the whole catalog. Ask for a rebase and confirm `build_index.py --check`
  passes.
- **`yazhi-dev#31`** (35 d, +30k/−25k) — far too large to review as one change. Ask for
  a split by feature (mandala / phone showcase / Yazh experience / bilingual engine).
- **`open-sangam#146`** (5 d) — recent and small; ask for a rebase now while it is
  fresh.

## 3. What to say to each contributor

The single highest-value action today is **replying**, even where the answer is "not
yet". A 100-day silence reads as a dead project; a "rebasing now, targeting merge this
week" reads as a live one.

Template:

> Thanks for this — sorry for the silence, we're fixing our review process.
> Current state: <mergeable / needs rebase / needs lint fix>.
> What we need from you: <rebase onto main / run `npm run lint` / split into N PRs>.
> Target: <date>.

## 4. Process fix so this does not recur

1. **A triage pass every Monday** (~20 minutes): `gh pr list --state open` across the
   public repos, and reply to every external PR, even if the reply is a deferral.
2. **Label on arrival.** `needs-rebase`, `needs-author`, `ready-for-review` — so the
   queue sorts itself and an author knows their state in the first hour.
3. **Cap review size.** A PR over ~400 changed lines gets split before review. `#31`
   at +30k is not reviewable by one person, and pretending otherwise is why it has
   waited 35 days.
4. **The 48-hour promise is currently aspirational.** Either staff the rota
   (`factory/CURRENT.md` lists one), or change the promise in `CONTRIBUTING.md` to
   something true. Do not leave a broken promise published.
