# RUNWAY — yazhi-dev · 2026-10-27 → 2027-03-31

## 1. Milestones

| Date | Milestone | Gate (how we know) | RAG |
|---|---|---|---|
| ~~18 Oct~~ → **31 Oct** | circle.yazhi.dev live (re-planned); build night; tokenizer campaign | Link live; ≥ 10 first contributions opened; post published | 🔴 |
| 15 Nov | Academy programme page (structure only) · 48-hour first-review policy · contributor credit page | Pages live; policy linked from CONTRIBUTING | ⚪ |
| 14 Nov / 21 Nov | Open Sangam campaign · Avai beta campaign + Avai chat entry on yazhi.dev | Campaigns out; `/chat` links to Avai in read mode | ⚪ |
| 20 Nov | Cohort-2 selection rubric + intake size | Doc approved | ⚪ |
| 25 Nov | Cohort-1 capstone showcase live | Every capstone has a repo/demo link | ⚪ |
| 28 Nov | Madurai Dev Space session with a college partner | Partner confirmed by 7 Nov | ⚪ |
| 30 Nov | 4 upstream contributions with Tamil probes opened | Links recorded in `CURRENT` | ⚪ |
| **1 Dec** | **Cohort-2 application form linked** | Form live; tracking on | ⚪ |
| 5 Dec | Illakiya beta campaign | — | ⚪ |
| 15 Dec | 15 colleges contacted | Contact log | ⚪ |
| 19 Dec | Sivakasi Dev Space session at the Foundry | — | ⚪ |
| 26 Dec | Adhan Kutty v1 campaign | Waits on adhan's release gate | ⚪ |
| **31 Dec** | 150 members · 20 external contributors · 30 merged external contributions · 2 upstream contributions merged · 100 applications · 2027–2030 research note | Counts in `CURRENT` §3 | 🔴 |

## 2. Critical path

```
platform decision (29 Oct) ─► good-first tasks + mentors (30 Oct) ─► build night / circle opens (31 Oct)
        ─► weekly contribution loop with a 48 h first review (from 1 Nov) ─► 30 merged external contributions (31 Dec)
```

**The arithmetic:** 30 merged external contributions in the 9 weeks from 1 Nov is **~3.5 merges a week**, and that needs a
supply of ~40 open good-first tasks and a review time under 48 h. Today review time across the org is up to 4 weeks (two
open-sangam contributions waiting since 30 Sep). **Review latency, not outreach, is the binding constraint.**

Upstream: two projects by 29 Oct → 4 contributions opened by 30 Nov → 2 merged by 31 Dec. Upstream maintainers set the
merge pace, so open early.

## 3. Cross-repo dependencies

| We need | From | By | Status |
|---|---|---|---|
| Canonical tokenizer numbers + repro script | adhan | 30 Oct | ⚪ |
| 10 labelled good-first tasks each, with first review in 48 h | adhan, open-sangam, other public repos | 30 Oct, then ongoing | 🔴 |
| Launch go/no-go + assets | open-sangam | 11 Nov (reader) / 18 Nov (Avai) | ⚪ |
| `/avai/ask` URL for the chat entry | open-sangam | 18 Nov | 🟡 |
| Circle sign-in session API live; read-only factory API (`/v1/factory/*`) + a seeded plan | platform | sign-in: before un-flagging Y9 · board: Q1 | ⚪ |
| Kutty release gate | adhan | 20 Dec | ⚪ |

## 4. Risk register

| # | Risk | L | I | Mitigation | Trigger to act | Owner |
|---|---|---|---|---|---|---|
| R1 | Contributors arrive and find no reviewers, then churn | 3 | 3 | Per-repo first-review rota; the 48 h policy published early (not 15 Nov); dashboard of review age | Any external contribution > 48 h | Circle lead |
| R2 | Public claims outrun the facts ("7B", "22+ languages") and damage credibility at launch | 3 | 2 | Y1; every number on the site cites a repo doc | Any new hero stat | Maintainer |
| R3 | Community platform slips again | 2 | 3 | Choose the lowest-effort platform now (D1) | No decision by 29 Oct | Circle lead |
| R4 | Large UI changes (Bubble UI v2, the experience overhaul) consume review capacity needed for contributors | 2 | 2 | Split, and park non-Q4 work | Review queue > 5 | Maintainer |
| R5 | Moderation gap when spaces open | 2 | 3 | Y4 before launch; CoC enforcement ladder | Unstaffed week | Circle lead |
| R6 | Tamil copy published without native review | 2 | 2 | Native sign-off before each campaign | Unreviewed string in a campaign | Media lead |

## 5. Cut list (in order)

1. Self-hosted community platform → repo-hosted discussions + Discord until Q1.
2. Madurai/Sivakasi in-person sessions → online sessions, if a partner isn't confirmed by 7 Nov.
3. Weekly carousels → one per week, keeping the monthly long post and the launch campaigns.
4. Bubble UI v2 features beyond what the Q4 dates need.
5. Never cut: the 48-hour first review, moderation staffing, and the accuracy of public claims.

## 6. Beyond Q4 (Q1 2027)

- Self-hosted circle; contributor credit and badges tied to merged contributions.
- Factory board live on the public, read-only API.
- Cohort-2 runs; capstones feed the good-first pipeline.
- Lighthouse + accessibility budget in CI (`lighthouserc.json` exists, not enforced).
