# Contributing to Yazhi

Yazhi builds Tamil-first, open technology: a Tamil language model and tokenizer, a classical-literature reader, a Tamil
keyboard, a learning pet for children, and the tools around them. If you want to help build it, welcome.

Before you do anything else, read the [Code of Conduct](CODE_OF_CONDUCT.md). Everyone who takes part accepts it.

## 1. Where to start

1. **Join the community** at **circle.yazhi.dev**, which launches 18 Oct 2026. Until then, the existing Discord
   ([discord.gg/yazhi](https://discord.gg/yazhi)) is where builders talk.
2. **Pick a repo** from the index below and read its README. Every repo has quick-start commands. Run them before you
   propose a change.
3. **Pick an issue** labelled `good first issue`, or ask in the community for one. Comment on the issue to say you are
   taking it, so two people don't do the same work.

## 2. Repository index

Every public repository in the [yazhi-lem](https://github.com/yazhi-lem) organisation:

| Repo | What it is | Main language | Start here |
|---|---|---|---|
| [adhan](https://github.com/yazhi-lem/adhan) | Tamil language model work: the Swaram tokenizer, corpus preparation, training scripts, evaluation and an inference server | Python | [good first issues](https://github.com/yazhi-lem/adhan/issues?q=is%3Aopen+label%3A%22good+first+issue%22) · README quick start |
| [open-sangam](https://github.com/yazhi-lem/open-sangam) | Classical Tamil (Sangam) corpus and a layered reader: Sangam Tamil, modern Tamil, English | Python, JavaScript | [good first issues](https://github.com/yazhi-lem/open-sangam/issues?q=is%3Aopen+label%3A%22good+first+issue%22) · README "Getting Started" |
| [illakiya](https://github.com/yazhi-lem/illakiya) | Tamil mobile keyboard, Android first. Nothing typed leaves the phone | TypeScript, Rust, Kotlin | [good first issues](https://github.com/yazhi-lem/illakiya/issues?q=is%3Aopen+label%3A%22good+first+issue%22) · README "Quick Start" |
| [yazh-unity](https://github.com/yazhi-lem/yazh-unity) | Yazh, a bilingual (Tamil–English) learning pet app for children (Unity 6) | C# | [good first issues](https://github.com/yazhi-lem/yazh-unity/issues?q=is%3Aopen+label%3A%22good+first+issue%22) · `docs/SETUP.md` |
| [yazhi-dev](https://github.com/yazhi-lem/yazhi-dev) | The yazhi.dev website (this repo) | TypeScript (Next.js) | [good first issues](https://github.com/yazhi-lem/yazhi-dev/issues?q=is%3Aopen+label%3A%22good+first+issue%22) · section 3 below |
| [yazhi-skills](https://github.com/yazhi-lem/yazhi-skills) | Agent skills and learning content in the portable `SKILL.md` format | Markdown, Python | [good first issues](https://github.com/yazhi-lem/yazhi-skills/issues?q=is%3Aopen+label%3A%22good+first+issue%22) · README "Install" |
| [styleguide](https://github.com/yazhi-lem/styleguide) | Fork of Google's style guides, kept as a code-style reference | HTML | Reference only |

The API gateway behind these products is not public.

## 3. Local setup for this repo (yazhi-dev)

```bash
git clone https://github.com/yazhi-lem/yazhi-dev.git
cd yazhi-dev
npm install
npm run dev      # http://localhost:3000
npm run lint     # run before you open a PR
npm run build    # make sure the production build passes
```

Check any page you change at phone width as well as desktop.

## 4. Branches and commits

- **External contributors:** fork the repo and name your branch `type/short-topic`, for example `fix/tamil-line-height`,
  `docs/repo-index` or `feat/glossary-tooltip`.
- **Team members:** use the branch name our issue tracker generates for the issue, so the PR links back to it.
- Keep each PR to one change. Write commit messages that say what changed and why.

## 5. Pull request rules

- **First review within 48 hours.** Every external PR gets a first human review within 48 hours of being opened. If yours
  hasn't, say so in the community's "PR review requests" area.
- **Contributors are credited by name.** Merged contributors are credited by name in release notes and, once it is live, on the contributor credits
  page. Tell us in the PR if you'd prefer a different name.
- **Human review for AI-written code.** You may use AI tools. A maintainer reviews every line before it merges, and you
  must understand and be able to explain what you submit.
- **Native-speaker review for Tamil.** Any Tamil (or Telugu) text that users will see is checked by a native speaker
  before it ships. Write Tamil natively. Don't machine-translate it from English. Never add letter-spacing or tracking
  to Tamil text, because it breaks grapheme clusters.
- **Protect people's data.** Don't commit personal data, API keys or secrets. Don't add code that sends users' data to a
  third-party service without discussing it in an issue first.
- **Tests and lint pass.** Run the repo's lint, tests and build before you ask for review.

## 6. Other ways to help

- **Corpus and annotation:** Tamil text, word lists and annotations for Open Sangam and the keyboard.
- **Reviewing Tamil:** if you are a native Tamil speaker, reviewing strings is one of the most valuable things you can do.
- **Reporting bugs:** open an issue with steps to reproduce, what you expected, and what happened.

## 7. Conduct

Everyone in this project follows the [Code of Conduct](CODE_OF_CONDUCT.md). Report problems as described there.
