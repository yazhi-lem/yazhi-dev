# yazhi.dev — யாழி

**Tamil-first sovereign AI — security, sovereign, societal — built in the open with workers and volunteers, from India for India, and then for the world.**

This repository is [yazhi.dev](https://yazhi.dev): the public, Tamil-first community site of Yazhi, with an AI chat workspace for builders.

---

## Our mission

Yazhi builds AI that thinks in Tamil instead of translating into it. Our word for "sovereign" is **தற்சார்பு**, which means self-reliance. We are working towards keeping Indian citizen data in India. Safety-critical logic lives in code, not only in prompts. Every Tamil string you see is written natively and checked by a native speaker, never translated from English.

Our 2030 vision, in our own words:

> By 2030, Yazhi Vision will be the definitive digital gateway for Tamil-first and regional-first economic activity. We are not a "platform"; we are a Movement-Led Enterprise. Our goal is to dismantle the digital-colonial grip of Big Tech by providing high-scale tools that respect Language Sovereignty and ensure Labor Value Retention.

> Language is not just a medium; it is a data asset. Current LLMs are trained on Western biases. … While global giants try to "translate," Yazhi Vision "thinks" in the local language.

The full text is in [`public/yazhi-vision-2030.md`](public/yazhi-vision-2030.md).

### What we hold to

- **Founding Collective.** Interns are apprentice founders, not labour. Work done is recorded, and ownership follows contribution.
- **தற்சார்பு (self-reliance).** Our goal is that Indian citizen data stays in India and production runs on no foreign AI APIs. We are moving towards it, starting with `/chat`, which will run on Adhan, our own Tamil model.
- **Model proposes, Python decides.** Safety-critical logic is enforced in code, never only in prompts.
- **Tamil written natively.** Every Tamil string users see passes a native reviewer.
- **Open by default.** Models, benchmarks, red-team suites and curricula are published for the commons unless they expose people's data.
- **Mission over marketing.** We ship first, then talk about it.

We draw on Marx (labour ownership), Ambedkar (dignity), Arignar Anna (language self-respect), and Sangam poetry as a design framework.

### 2026: what we're working towards

- **Model:** a Tamil tokenizer benchmark, and Adhan Kutty v1 released publicly on Hugging Face.
- **Community:** launch circle.yazhi.dev (not live yet) and see external contributors shipping merged code.

> "Business is a form of social organizing. Let us organize for the many, not the few."

---

## Where yazhi.dev fits

Yazhi is built across Sivakasi and Madurai, which are our build, cultural and commune base, and Hyderabad. The public code lives in the [yazhi-lem](https://github.com/yazhi-lem) organisation:

| Repo | What it is |
|---|---|
| [`adhan`](https://github.com/yazhi-lem/adhan) | Sovereign Tamil LLM: the Swaram tokenizer, corpus prep, training scripts and an inference API |
| [`open-sangam`](https://github.com/yazhi-lem/open-sangam) | Open platform for classical Tamil literature, with a corpus and a layered reader |
| [`illakiya`](https://github.com/yazhi-lem/illakiya) | Tamil mobile keyboard |
| [`yazh-unity`](https://github.com/yazhi-lem/yazh-unity) | Client app for Yazh, the learning personal pet |
| [`yazhi-skills`](https://github.com/yazhi-lem/yazhi-skills) | Skills and learning content |
| **`yazhi-dev`** (this repo) | The public site: the community front door, onboarding, and the `/chat` workspace |

`yazhi-api`, the inference gateway behind the chat workspace, is not public.

**Federals.** Work is organised into Federals: small pods that each own a project end to end. Each Federal shows one shipped thing at a weekly demo.

**FDE Foundry.** Through the Yazhi Academy, the FDE Foundry is our Forward Deployed Engineering apprenticeship. It started with a first cohort in Sivakasi and covers Git workflows, SSH, access to our own inference hardware, LLMOps, evals and guardrails. **Applications for cohort 2 open on 1 December 2026.**

---

## What's in this repo

A Next.js 16 (App Router) site with React 19, Tailwind CSS 4, and three.js through React Three Fiber, with GSAP, Framer Motion and Lenis for motion. Visitors can switch between Tamil and English.

| Route | What it does |
|---|---|
| `/` | Sangam-era 3D landing, project stories, and community calls to action |
| `/about`, `/privacy` | About Yazhi; privacy notice |
| `/onboarding` | Join flow, including `?track=developer` for builders |
| `/profile/[id]`, `/profile/edit` | Community profiles |
| `/chat` | AI chat workspace (see below) |

More detail is in [`docs/`](docs/): `3D-ARCHITECTURE.md`, `DESIGN-SYSTEM.md`, `SCROLL-EXPERIENCE.md`, `AUDIO-SETUP.md`, `DEPLOYMENT-GUIDE.md` and `PRD-DEVELOPER-COMMUNITY.md`. The roadmap is in [`NEXT_ACTION.md`](NEXT_ACTION.md).

---

## Getting started

You need Node.js 22 (the version CI uses) and npm. The repo ships a `package-lock.json`.

```bash
git clone https://github.com/yazhi-lem/yazhi-dev.git
cd yazhi-dev
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Most pages live in `src/app/`, and the dev server reloads them as you edit.

| Script | What it does |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Production build (CI runs this on every PR to `main`) |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

### `/chat`: agents, sessions and the yazhi-api backend

The chat workspace lives at `/chat`. Each agent is bound to a fixed provider and has its own persona and system prompt (see `src/lib/chat/agents.ts`). Sessions and messages are stored in the browser's localStorage.

Replies are **streamed through the yazhi-api backend**, never from the browser directly. Copy `.env.example` to `.env` and set:

- `YAZHI_API_URL`: base URL of the yazhi-api service
- `YAZHI_API_KEY`: optional bearer token
- `YAZHI_CHAT_PATH`: defaults to `/v1/chat/completions`

The backend contract is OpenAI-compatible Chat Completions with SSE streaming. `src/lib/chat/backend.ts` is the single integration point and shows the exact request and response shape. If `YAZHI_API_URL` isn't set, the UI streams a friendly "not configured" notice instead of failing silently.

### Deploying

See [`docs/DEPLOYMENT-GUIDE.md`](docs/DEPLOYMENT-GUIDE.md) and `scripts/deploy.sh`.

---

## Contributing

If you're building AI for your own mother tongue, you're welcome here.

1. **Join the conversation** on [Discord](https://discord.gg/yazhi), or use the site's "Join as a developer" path (`/onboarding?track=developer`).
2. **Read [`CONTRIBUTING.md`](CONTRIBUTING.md)** to find where things live and what help is needed right now.
3. **Pick a repo and run its quick start** before you propose changes. In this repo, help is welcome on content, the onboarding and community flows, the 3D experience and `/chat`.

A few rules every contribution follows:

- **Human review.** AI-generated code doesn't reach production without founder review.
- **Native-speaker sign-off.** Every Tamil string users see is checked by a native speaker. Write Tamil natively; don't translate it from English.
- **Brand and type.** Follow [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md) and `brand-kit/`. Never letter-space Tamil script, because tracking splits grapheme clusters.
- **Honest framing.** Mark drafts as drafts, and keep what's built separate from what's planned.

Good first issues are labelled for community contributors, and they get a first review within 48 hours.

---

## License

There is no license file on `main` yet. Open PR [#32](https://github.com/yazhi-lem/yazhi-dev/pull/32) proposes **GPL-3.0**. This section will be updated when it merges.
