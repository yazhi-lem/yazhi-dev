# CURRENT — yazhi-dev · 2026-10-27

> Reset every Monday. Facts only; each number cites its source. The template and rules are in [`README.md`](README.md).

## 1. Headline

**🔴 Red on community. 🟡 Amber on site and media.** The site ships cleanly: the build/deploy is green, and the code
of conduct, contribution guide, moderation rota, repo index and GPL licence all landed. But the first Q4 milestone,
**circle.yazhi.dev on 18 Oct, slipped**, and its dependencies are also late: 40 good-first tasks (16 Oct) and the two
upstream projects (25 Oct). Together these gate every community goal (150 members, 20 external contributors, 30 merged
external contributions). The next fixed date is the **31 Oct build night + tokenizer campaign (4 days)**, and the
About page currently misstates the model that campaign is about.

## 2. Health

| Workstream | RAG | Fact (source) | Next checkpoint |
|---|---|---|---|
| Site build/deploy | 🟡 | `Build & Deploy Yazhi Site` is green on `main` (26 Oct), but its deploy job only *packages* the build; nothing in this repo publishes yazhi.dev | Document or automate the real publish step |
| Public accuracy | 🔴 | About page: "Adhan (அதன்) — a 7B-parameter open AI model for 22+ Indian languages" (`src/app/about/page.tsx:42`). The real model is 14.5M params, Tamil-first, research stage, and the name is ஆதன் | Fixed by 30 Oct |
| circle.yazhi.dev (Dev Spaces) | 🔴 | Due 18 Oct; the README unlinked it "until it is live" on 23 Oct; community platform choice not recorded | New launch date |
| Contributor funnel | 🔴 | 40 good-first tasks (due 16 Oct) not yet labelled; `/repos` index live | 40 labelled tasks |
| Upstream LLM-security track | 🔴 | Pick two projects (due 25 Oct) not done; next: 4 upstream contributions opened by 30 Nov, 2 merged by 31 Dec | Decision 29 Oct |
| Governance docs | 🟢 | Code of conduct, contribution guide, moderation rota, GPL-3.0 | Rota staffed |
| Circle sign-in / Bubble UI | 🟡 | Bubble UI + Circle sign-in merged on 23 Oct; the platform-side session API it relies on is not live yet; a large follow-up (Bubble UI v2, Mission Control, Yazhi Chat) is in review | Review the follow-up |
| Avai chat on yazhi.dev | 🟡 | Due 18 Oct (internal alpha); a `/chat` workspace exists (Gemini/ChatGPT agents with sessions); Avai is not wired in | Wire it to `/avai/ask` before 21 Nov |
| Media | 🟡 | Campaigns: 31 Oct tokenizer, 14 Nov Open Sangam, 21 Nov Avai, 5 Dec Illakiya, 26 Dec Adhan Kutty; status of the Tinai media pipeline (due 19 Oct) not recorded | Tokenizer post ready, 30 Oct |
| Academy / FDE Foundry | ⚪ | Programme page 15 Nov · rubric 20 Nov · capstone showcase 25 Nov · cohort-2 form 1 Dec | Page outline, 7 Nov |
| Tamil copy | 🟡 | Main-site strings were rewritten by an AI reviewer and are marked "needs scholar confirmation" | Native sign-off |
| CI quality gate | 🟡 | CI only builds and deploys; no lint or test gate before merge | Add lint |

## 3. Key metrics

| Metric | Now | Target (31 Dec) | Source |
|---|---|---|---|
| circle.yazhi.dev members | 0 (not live) | 150 | Q4 plan |
| External contributors (merged) | _count it_ | 20 | org-wide history |
| Merged external contributions | _count it_ | 30 | same |
| Labelled good-first tasks | _count it_ | 40 (was due 16 Oct) | label search across the public repos |
| First-review time on external contributions | up to 4 weeks (two open-sangam contributions waiting since 30 Sep) | ≤ 48 h | review queues |
| Dev Space sessions held | 0 | 3 (31 Oct online, 28 Nov Madurai, 19 Dec Sivakasi) | — |
| Upstream LLM-security contributions merged | 0 | 2 | — |
| Cohort-2 complete applications | 0 (form opens 1 Dec) | 100 | — |

## 4. In review

| Change | What | Age | State | Needed to land |
|---|---|---|---|---|
| Bubble UI v2 | One package, library page, light theme, Mission Control, Yazhi Chat with Yazhi's agents | today | large | Split by surface; design sign-off; check that it is public-safe (no private API internals) |
| Telugu workspaces | Telugu Legal & Healthcare chat workspaces | 12 days | waiting on platform endpoints | Decide whether it is in Q4 scope |
| Experience overhaul | Thinai mandala, Adhan phone showcase, Yazh experience, bilingual engine | 13 days | awaiting review | Scope check against Q4; the Adhan showcase must use true numbers |

## 5. Blockers (oldest first)

| # | Blocker | Since | Blocks | Ask / who |
|---|---|---|---|---|
| B1 | Community platform for circle.yazhi.dev not chosen and recorded (was due 4 Oct) | 4 Oct | circle launch, members goal, sessions | Circle lead: decide by 29 Oct |
| B2 | 40 good-first tasks not labelled | 16 Oct | build night (31 Oct), contributor goals | Each repo's DRI labels 10, each with acceptance criteria |
| B3 | Moderation rota has no confirmed moderators | 26 Oct | opening any public space | Circle lead: two named moderators |

## 6. Decisions needed

| # | Decision | Options | Recommendation | Decider | By |
|---|---|---|---|---|---|
| D1 | circle.yazhi.dev platform | self-hosted forum (e.g. Discourse/Zulip) · repo-hosted discussions + the existing Discord · build on Circle sign-in | **Repo-hosted discussions + Discord now; self-hosted in Q1.** It ships this week, and contributions happen in the repos anyway | Circle lead | 29 Oct |
| D2 | New circle launch date | 31 Oct (build night) · 7 Nov | **31 Oct**, launched *at* the build night, so the first members arrive with a task | Circle lead | 29 Oct |
| D3 | Two upstream LLM-security/eval projects | — | Pick projects where Tamil probes fit an existing plugin or probe API, so a first contribution can merge within weeks | Circle lead | 29 Oct |
| D4 | Q4 scope for the experience overhaul and Telugu workspaces | land · park | **Park** both unless they serve a Q4 date | Maintainer | 31 Oct |

## 7. Done last iteration (12–27 Oct)

Code of conduct + contribution guide; moderation rota (internal links removed) · `/repos` open-source repo index · Bubble UI, Yazhi UI library, Circle sign-in · GPL-3.0 licence; mission-led README · Tiṇai order unified across site, gallery and 3D zones · Tamil main-site strings rewritten (AI review, pending scholar) · Factory board spec
