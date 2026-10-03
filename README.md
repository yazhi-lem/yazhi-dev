This is the official developer portal and community hub for the **Yazhi** sovereign Tamil AI ecosystem.

See [NEXT_ACTION.md](./NEXT_ACTION.md) for the roadmap, **October 2026 Pilot**, and **December 2026 Launch** deliverables.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## /chat — Yazhi Chat

`/chat` is a Bubble UI conversation app over Yazhi's own agents, served by
yazhi-api (`yazhi.v1.AgentQueryService/QueryAgent`):

- **Avai** (அவை): artefacts, inscriptions and excavation sites, with catalogue records
- **Sevai** (சேவை): government schemes, eligibility and required documents

Only agents whose tools are all read-only are offered. The Yazhi mark opens
the floating menu (new conversation, conversations, agents, theme, language,
about).

**Sovereignty gate.** Before a message is forwarded, the server asks
`yazhi.v1.YazhiSystem/GetHealth` and sends the turn only when yazhi-api
reports zero outbound calls, local inference and on-prem data. Otherwise
the chat pauses and says why (`src/lib/chat/backend.ts`). Conversations
are kept only in the browser (localStorage).

Configure with `YAZHI_RPC_URL` and `YAZHI_API_KEY` (see `.env.example`).

## /foundry — Yazhi Bubble Interface

`/foundry` shows Yazhi's six domain data programmes (legal, education,
governance, health, sovereign, core): their YazhiFactory pipelines, stage
chains and corpus quality, read from yazhi-api's `YazhiInsight` service.
It is the first surface built with the **Yazhi Bubble Interface** —
`src/bubble/`, a server-first component system where a page is a list of
JSON blocks rendered by `<BubbleView>`.

Set `YAZHI_RPC_URL` (a Connect/gRPC-JSON gateway in front of yazhi-api)
and `YAZHI_API_KEY` to read live data; without them the pages show the
audited sample, clearly labelled. Scope, structure and roadmap:
[docs/BUBBLE-INTERFACE.md](./docs/BUBBLE-INTERFACE.md); API reference, every
calculation and recipes: [docs/YBI-DEV-GUIDE.md](./docs/YBI-DEV-GUIDE.md).
Component library: **`/ybi`**, in the *Mugil* theme (Yazh's pastel clouds),
with a switch to the dark *Ink* theme.

## Learn More

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
