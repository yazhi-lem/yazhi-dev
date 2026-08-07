This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

## /chat — agents · Gemini · ChatGPT

The chat workspace lives at `/chat`. Agents are bound to a fixed provider
(Gemini or ChatGPT) and each carries its own persona/system prompt
(see `src/lib/chat/agents.ts`). Sessions and messages persist in the
browser via localStorage.

Replies are **streamed through the yazhi-api backend**, never from the
browser directly. Copy `.env.example` to `.env` and set:

- `YAZHI_API_URL` — base URL of the yazhi-api service
- `YAZHI_API_KEY` — optional bearer token
- `YAZHI_CHAT_PATH` — defaults to `/v1/chat/completions`

The backend contract is OpenAI-compatible Chat Completions with SSE
streaming; `src/lib/chat/backend.ts` is the single integration point and
shows the exact request/response shape. Until `YAZHI_API_URL` is set, the
UI streams a friendly "not configured" notice instead of failing silently.

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
