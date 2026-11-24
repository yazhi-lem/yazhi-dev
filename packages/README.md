# packages/

Shared code used by the site and the product workspaces. Each package is
`private: true`; the repo is the distribution.

| Package | What it is | Read |
|---|---|---|
| `@yazhi/bubble` | The Bubble UI system: components, modules, pages, five tiṇai themes, Hairline figures, Mission Control, design tokens and design PDFs | [`bubble/README.md`](bubble/README.md) |
| `@yazhi/i18n` | Site chrome, the language switcher and the Tamil string helpers | [`i18n/README.md`](i18n/README.md) |
| `@yazhi/workspace` | The shared workspace shell behind `apps/` (Guru, Nyaya, Kural, Kadai) | [`workspace/README.md`](workspace/README.md) |

`@yazhi/bubble` also carries the Bubble design system in
[`bubble/design-system/`](bubble/design-system/README.md); the brand kit itself
is canonical at [`../brand-kit/`](../brand-kit/README.md).
