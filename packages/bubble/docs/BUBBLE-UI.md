# Bubble UI

A Bubble screen has three parts, after the original sketch: a **conversation
canvas**, a **tray of bubbles** and a **composer** with the **Circle** button.
The live developer docs are at `yazhi.dev/bubble`.

## Bubbles

A bubble is one agent, tool or view that a builder made. It is described by
a **manifest** (`src/lib/manifest.ts`, schema `yazhi.bubble/v0`):

| Field | Meaning |
|---|---|
| `id`, `version`, `name`, `taName` | Identity; `taName` is a draft until a native speaker reviews it |
| `description`, `accent`, `size` | How it shows in the tray; size is `s`, `m` or `l` |
| `agent.systemPrompt`, `agent.greeting` | The agent |
| `agent.fivePosture` | Wrap the prompt in the Five-Posture Reasoning Kernel |
| `runtime.prefer`, `runtime.model`, `runtime.deviceModel` | Where it runs (below) |
| `permissions` | Only `yazhi-api` and `clipboard`; the host grants nothing undeclared |
| `author` | The builder's Circle account; absent on unsigned manifests |

`validateManifest()` checks a manifest; `effectiveSystemPrompt()` returns the
prompt actually sent.

## The tray

- Bubbles come in three sizes, radius ratio **1 : 0.74 : 0.55** (38/28/21),
  sized by how much work lives behind them, packed so they never touch
  (`modules/pack.ts`, `modules/BubbleTray.tsx`). The Yazhi mark keeps its
  own brand ratio, 1.00 : 0.74 : 0.56.
- `MagneticTray` (`tinai/`) is the living version: bubbles swell toward the
  pointer on the landscape's spring, a choice sends a ring to neighbours by
  distance, and it has a vertical mode for a rail.
- Hit areas never move; keyboard focus lifts a bubble the way hover does.

## Composer and Circle

The composer leads with the Circle button (your account), then the text
box, then send — or stop while a reply streams. Enter sends; Shift+Enter
breaks a line; **Enter never sends while an input method is composing**
(Tamil keyboards confirm letters with Enter).

## Runtimes

| Runtime | Path | Needs |
|---|---|---|
| `device` | Browser → an OpenAI-compatible model server on this machine or LAN (llama.cpp, Ollama, a yazhi-one box) | Nothing leaves the machine; works offline |
| `yazhi-api` | Browser → yazhi.dev → yazhi-api (Adhan) | A Circle session and a network path |

The host prefers the bubble's choice, never uses yazhi-api unless the bubble
declared it, and falls back to the device when offline (`lib/runtime.ts`).

## Boards built with bubbles

The factory board (`docs/factory-board.md` in the app) shows the launch plan
as bubbles: one per project, sized by open iterations, a ring for share
done, a fill for the current iteration's status, a "Now" bubble, and a
detail sheet. Read-only, bilingual, keyboard and screen-reader accessible,
and it respects reduced motion.

## Layers of the library

1. **components/** — primitives every app shares: bubble, pills, citations,
   guardrails ("I don't know"), confirm gate, messages, composer, verse.
2. **modules/** — app blocks: cited answers, runbooks, hint ladder, verse
   reader, commerce cards, Five-Posture trace, consent gate, tray.
3. **pages/** — full app templates: Avai, Nyaya, Kural, Guru, Kadai, Open
   Sangam, Yazh (parent gate).

Each layer is built only from the one below. Dress any of them in a tinai
with `TinaiScope` (see [THEMES.md](THEMES.md)).
