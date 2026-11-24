# src/

The Next.js app. Start with `app/` for routes and `components/` for the screen
pieces; shared logic lives in `lib/`.

| Path | What it is |
|---|---|
| `app/` | App Router routes: `/`, `/about`, `/services`, `/contact`, `/privacy`, `/onboarding`, `/profile`, `/chat`, `/app`, `/bubble`, `/repos` |
| `app/(workspaces)/` | The four product workspaces: `/guru`, `/nyaya`, `/kural`, `/kadai`, plus `/workspaces` |
| `app/api/` | Route handlers for the API kernel and Bubble runtime |
| `components/` | Sections, app shell, chat, Mission Control, Bubble host, workspace UI |
| `lib/` | Content, i18n, users, chat backend, Circle session, API kernel, route helpers |
| `lib/api/` | The typed API kernel: manifest, registry, handlers, OpenAPI |
| `lib/chat/` | Agent registry and the chat backend integration |
| `lib/circle/` | Circle session and client |
| `data/` | Mock profile and feed fixtures used by the demo pages |
| `contexts/`, `hooks/` | React context and reusable hooks |
| `styles/` | Global CSS and design tokens |
| `three/` | The Sangam 3D world: scenes, materials and hooks |

Shared packages are in [`../packages/`](../packages/README.md); the full
documentation index is in [`../docs/README.md`](../docs/README.md).
