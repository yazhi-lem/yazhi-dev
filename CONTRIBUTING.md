# Contributing to Yazhi

Yazhi is sovereign AI for Indian languages, built by a small team in
Virudhunagar and Hyderabad — and by developers across India building AI for
their own mother tongues. If that's you, welcome.

## Where things live

Yazhi is three projects sharing one foundation:

| Repo | What it is | Contribute here for |
|---|---|---|
| [`yazhi-lem/adhan`](https://github.com/yazhi-lem/adhan) | The open Indic model — 7B parameters, 22+ languages, a tokenizer built for agglutinative grammar instead of retrofitted from English | Model code, the swaram tokenizer, training pipelines, corpus tooling, evals |
| [`yazhi-lem/open-sangam`](https://github.com/yazhi-lem/open-sangam) | Open platform for classical Tamil literature — poem analysis, thinai classification, linguistic study | Corpus work, annotation tooling, the analysis frontend |
| `yazhi-lem/yazhi-dev` (this repo) | The site you're reading this on | Content, the onboarding/community flows, the immersive 3D experience |

`yazhi-api` (the inference orchestrator and account system behind Yazh and
the Yazhi API) is not public — see that repo's own `CONTEXT.md` if you have
access.

## Get in

1. **Join the Discord** — [discord.gg/yazhi](https://discord.gg/yazhi). This
   is where day-to-day builder conversation happens: questions, what's
   shipping, what needs a hand.
2. **Or use the site's onboarding** — the
   [Community section](/#community) has a "Join as a developer" card that
   routes through `/onboarding?track=developer` straight to the Discord
   invite. Functionally the same door, framed for people arriving from the
   site rather than GitHub.
3. **Pick a repo and read its docs first** — `adhan/README.md` +
   `adhan/ROADMAP_JAX_SLM.md`, or `open-sangam/README.md`. Both have
   working quick-start commands; run them before proposing changes.

## What "contribute" means right now

- **Code**: PRs against `adhan` or `open-sangam`. Sole engineering and
  editorial gate — no AI-written code merges without human review, no
  language string ships without a native speaker checking it (see the
  team's own working norms in the founding deck).
- **Corpus / annotation**: both projects need Tamil (and soon Telugu) data —
  ask in Discord about the current collection priorities.
- **Language expansion**: the roadmap is Tamil now, Telugu next, then
  Kannada and Malayalam. If you speak one of those and write code, say so
  in Discord — this is exactly the gap the developer track exists to close.

## Yazhi API access

A self-serve Yazhi API key isn't live yet. The plan for how that works —
onboarding through this site into a Circle-provisioned account on
`yazhi-api` — is written up in
[`docs/PRD-DEVELOPER-COMMUNITY.md`](docs/PRD-DEVELOPER-COMMUNITY.md). Until
that ships, API access for serious integrations is provisioned by hand —
ask in Discord.
