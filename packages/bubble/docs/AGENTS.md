# Yazhi's agents

From the Aram harness (§4). They run on **Adhan** through yazhi-api, and
every turn passes the Five-Posture Reasoning Kernel (context, reason, plan,
respond, reflect). Defined in `src/lib/agents.ts`.

| Agent | Lives in | Tinai | Rule it always keeps | Status |
|---|---|---|---|---|
| Pulavar | Avai | Kurinji | A source for every claim, else "தெரியவில்லை" | Public beta from 21 Nov |
| Nyaya | Nyaya | Marutham | Information, never advice; refer to legal aid | Closed beta from 12 Dec |
| Kural | Kural Desk | Palai | No system change without a runbook and a human confirm | Internal 30 Nov · paid pilot 15 Dec |
| Guru | Guru | Mullai | The hint ladder — never hand over the answer | Paid pilot from 28 Nov |
| Annachi | Kadai | Marutham | Payment intent only — no money moves | In development |

Every agent's system prompt carries the shared Aram rules: a source or
"தெரியவில்லை", drafts marked as drafts, no caste, and natural Tamil first.
Each has a persona, a greeting, three first questions and one sample
exchange; samples are illustrative and their Tamil is a draft.

## Held back on purpose

- **Orchestrator** and **Reflection** work behind yazhi-api, not in a chat.
- **Guard-kid** and the **Yazh** agents (tutor, literature, government,
  news, culture for children) stay out of any public screen until counsel
  sign-off and verified parental consent (Aram rule 4).

## Guests

Yazhi Chat in the app also lists general assistants on outside models
(Gemini, ChatGPT), labelled as guests. They are not part of this package:
the Aram harness keeps foreign AI APIs out of production.
