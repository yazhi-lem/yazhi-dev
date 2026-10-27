# NEXT — yazhi-dev · iteration 1 · 2026-10-28 → 2026-11-10

**Iteration goal:** recover the community launch. By 10 Nov: circle is live, has opened its doors at the 31 Oct build
night, offers 40 labelled first tasks and has an upstream track chosen. Along the way, the site says only true things
about Yazhi's models, and the tokenizer and Open Sangam campaigns are ready.

**Capacity:** _set this to measured velocity × 2 weeks_. Most items are S; this iteration is about coordination, not
code. **Committed:** P0 ≈ 6 days · P1 ≈ 5 days

| ID | P | Task | DRI | Size | Exit criterion | Depends on | Due |
|---|---|---|---|---|---|---|---|
| Y1 | P0 | **Fix the Adhan claim.** About page (`src/app/about/page.tsx:42`): spell the name ஆதன் (not அதன்), describe it as a Tamil-first small language model with the Swaram tokenizer, at research stage; no parameter or language counts that adhan's model card does not state | Maintainer (wording from the adhan DRI) | S (0.5d) | Merged; `grep -rn "7B" src/` returns nothing | — | 30 Oct |
| Y2 | P0 | **Choose the circle platform and its launch date** (`CURRENT` D1, D2) | Circle lead | S (0.5d) | Decision in `factory/RUNWAY.md`; CONTRIBUTING updated with the real link and date | — | 29 Oct |
| Y3 | P0 | **Label 40 good-first tasks**: 10 each in adhan, open-sangam, yazhi-dev and a fourth public repo. Each has acceptance criteria, files to touch and a mentor | Repo DRIs; Circle lead tracks | M (2d total) | A label search across the public repos shows ≥ 40 open good-first tasks, each with a "done when" line | — | 30 Oct |
| Y4 | P0 | **Staff the moderation rota**: two named moderators + an escalation contact | Circle lead | S (0.5d) | `docs/community/MODERATION_ROTA.md` has names for weeks 1–4 | — | 30 Oct |
| Y5 | P0 | **Run the 31 Oct online build night**: agenda, good-first board, mentor per repo, "first contribution opened" tracker | Circle lead | M (1.5d) | ≥ 10 first contributions opened; attendance + contribution list recorded in `CURRENT` | Y2–Y4 | 31 Oct |
| Y6 | P0 | **Tokenizer benchmark campaign**: the month's long post on yazhi.dev + carousel, built from adhan's canonical table and repro script | Media lead | M (1.5d) | Published 31 Oct; every number links to adhan's benchmark doc | adhan N3 | 31 Oct |
| Y7 | P0 | **Pick two upstream LLM-security/eval projects** and write the "Tamil probe" plan for each | Circle lead + security reviewer | S (1d) | Two projects named, with maintainer contact and probe scope; the 30 Nov goal broken into 4 contribution tasks | — | 29 Oct |
| Y8 | P1 | **Review Bubble UI v2**: split it into reviewable parts (package/library, theme, Mission Control, Yazhi Chat); design sign-off; public-safe check | Maintainer + design | M (2d) | Merged in parts, or a split plan agreed | — | 6 Nov |
| Y9 | P1 | **Feature-flag Circle sign-in** until the platform session API is live in production | Maintainer | S (0.5d) | Sign-in hidden when the API is unreachable; no dead-end login | — | 4 Nov |
| Y10 | P1 | **Open Sangam launch campaign** (14 Nov) assets: post, carousel, short | Media lead | M (1.5d) | Scheduled, waiting only on open-sangam's go/no-go | open-sangam R9 | 12 Nov |
| Y11 | P1 | **Academy programme page outline** (structure only: curriculum, weeks, deliverables) | Academy lead | S (1d) | Content doc reviewed; page built in Y-next for 15 Nov | — | 7 Nov |
| Y12 | P1 | **Lint gate before merge**: run `npm run lint` + `next build` on every proposed change | Maintainer | S (0.5d) | A change with a lint error fails the check | — | 6 Nov |
| Y13 | P1 | **Park or land** the experience overhaul and Telugu workspaces (`CURRENT` D4) | Maintainer | S (0.25d) | Each is merged, closed or labelled `parked-2027` | — | 31 Oct |

## Explicitly not this iteration

The factory board (blocked on the API and on an empty plan), developer API-key dashboards, the `yz` installer page,
and the CDN work. None are in the Q4 plan.
