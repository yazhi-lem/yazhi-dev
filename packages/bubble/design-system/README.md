Yazhi's Bubble UI: a Tamil-first interface where every app, agent and tool is a bubble, every claim carries its source, and every screen lives in one of the five Sangam tiṇai — Palai, Mullai, Kurinji, Marutham, Neytal. The base is the Sovereign Palette (Ink, Cream, Gold, Cobalt); the landscapes dress it.

## Two modes

- **Bubble** (everything below) is the default: Ink and Cream grounds, gold for the one action, lit-sphere bubbles, 44px targets. Use it for yazhi.dev, Avai, Open Sangam and the builder surfaces.
- **Thiṇai mode** is Bubble made plainer for Guru, Nyaya, Kural and the children's products: pastel landscape grounds plus High contrast and Night, a green go / red stop pair instead of gold, flat bubbles always shown with their name, 56–72px targets and text from 18px, all in rem. Its tokens carry the `tn-` prefix and its classes the `yz-` prefix; a screen opts in with `data-theme="light" data-tn="<landscape>"` on its root (Night: `data-theme="dark"`). Its rules are in the Thiṇai mode section and apply only inside such a screen.
- Shared by both: the mark and its rules, Mission Control's gold-ringed bubble, the tiṇai-to-app mapping, citations and "I don't know", ConfirmGate, draft tags, Nunito and Baloo Thambi 2, and never letter-spacing Tamil.

## Content fundamentals

- **Tamil first, English beside it.** Natural Tamil leads; English follows or sits as a gloss. Mark every Tamil line, persona name and gloss that has not passed native review with a DraftTag ("draft · native review") or "(draft gloss)". The screen says so; never hide it.
- **A source, or "I don't know".** Every claim carries a CitationMark and a SourceCard. When no stored source supports an answer, show IDontKnow — "தெரியவில்லை" — and say what would help. Never guess.
- **Information, not advice.** Nyaya shows the legal Disclaimer under every answer. Kadai records a payment *intent* only: "No money moves through Yazhi."
- **Think, then act.** Any step that changes a system sits behind a ConfirmGate that names the action, what it affects and the rollback.
- **Children first.** Yazh shows nothing until a parent's consent is verified.
- **Voice comes from the landscape.** Each tiṇai has a persona with its own voice and copy for empty, loading, success, error and confirm (see the Tiṇai sections). Quote their lines; don't invent new ones in a different voice. Examples: Kurinji's empty state is "எங்கிருந்து தொடங்கலாம்? · Where shall we begin?"; Marutham's error is "I can't match this to a section, so I won't state it."
- **Plain and exact.** Sentence case. No emoji. Glyphs in UI are functional only: ✓ verified, ✕ failed, ▷ send, ■ stop, ↗ external.
- **Placeholders look like placeholders.** Sample legal text is bracketed ("[Sample Act name], [year]"), sample prices show "₹ —", and every template showing them carries the "Sample data" Disclaimer.

## Visual foundations

### Colour
- Ground is `night`, raised surfaces `night-2`, text `ivory`, secondary text `ivory-dim`. By night that is Ink `#0a0a0a` and Cream `#f8f5ef`; by day cream paper and ink text. Pick the theme with `[data-theme]`; the repo does the same with `color-scheme` and `light-dark()` pairs.
- Gold is the one action colour: primary buttons are `gold` with `night` text, hover `bronze`; the focus ring is 2px solid `gold` with a 2px offset; selection is `gold` on `night`.
- Status tones reuse the tiṇai hues: ok `mullai`, warn `gold`, risk `palai`, info `neytal`. Each also carries a word or symbol — never colour alone.
- `accent` is whatever the current app or landscape says (Avai `kurinji`, Nyaya `marutham`, Kural Desk `palai`, Guru `mullai`, Kadai `gold`, Open Sangam and Yazh `neytal`). Use it for eyebrows, citation marks, the current step and the one accent edge on a page.
- Tints are the colour over the ground, not new hexes: borders `ivory` at 10–20%, user bubbles `ivory` at 10%, notice washes a hue at 5%, citation chips `accent` at 20%.
- `cobalt` belongs to the mark only, on Cream or white.
- The `ocean-*`, `rock-*` and `ruin` tokens are the site footer's deep-sea scene and are the same in both themes.

### The tiṇai environments
- Each landscape has nine tokens — `<tiṇai>-ground`, `-surface`, `-hi`, `-edge`, `-mid`, `-lo`, `-accent`, `-text`, `-text-dim` — with a dark and a light value. Wrap a region in TinaiScope (or `data-tinai="<tiṇai>"`) and `night`, `night-2`, `ivory`, `ivory-dim` and `accent` follow it, so every component takes the landscape on.
- Choose the tiṇai from what the screen is for: Palai for security and infrastructure, Mullai for community and teaching, Kurinji for launches and onboarding, Marutham for civic, legal and commerce, Neytal for the diaspora and language loss. Change landscape across whole sections, never inside one card.
- Switching landscape cross-fades every ground and stroke over 900ms (`cubic-bezier(0.32, 0.72, 0, 1)`); instant under reduced motion.

### Type
- Display and section headings: Playfair Display Bold (`display-*`, leading 1.1). The wordmark alone is Playfair Display Black at −3px (`wordmark`).
- Body: Nunito, a rounded sans, at 400 with 600 for emphasis and labels (`body-*`, leading 1.55). Soft terminals match the bubbles; keep body copy at `body-base` or larger for reading, `body-sm` and `body-xs` for UI.
- Tamil text: Baloo Thambi 2 at 400/600 — the Tamil member of the Baloo family, round like Nunito, so mixed Tamil–English lines sit together. Tamil headings inside Playfair fall back to Noto Serif Tamil. Tamil text uses leading 1.75 (`tamil-base`, `tamil-lg`) and 1.35 in display (`tamil-display`). **Never letter-space Tamil**, and cut it by grapheme (`Intl.Segmenter`), so கு is never torn into க and ு.
- Labels: IBM Plex Mono at 10px, uppercase, `tracking-wider` (`mono-label`) — Latin only; a Tamil pill drops to 11px with no tracking.
- The scale is a 1.25 ratio from 0.75rem to 3.815rem.

### Shape, space and depth
- Round, never sharp: pills and bubbles are `radius-pill`; cards `rounded-xl` (12px) to `rounded-2xl` (16px); site cards `radius-card`.
- Borders, not shadows. A 1px hairline separates everything; no drop shadows, glows or gradients — except the Bubble's single lit-sphere gradient, built from its accent.
- Tray bubbles come in three radii, `bubble-l` 38px, `bubble-m` 28px, `bubble-s` 21px, sized by how much work lives behind them and packed so they never touch.
- Spacing follows the 4px Tailwind scale (`p-3`, `p-4`, `gap-2`); sections breathe at `space-section`, content caps at `max-w`.

### Motion
- Each landscape has a spring: Palai heavy (k 70, c 17), Mullai patient (k 85, c 18), Kurinji buoyant (k 120, c 15), Marutham critically damped (k 100, c 20), Neytal tidal (k 55, c 10). Springs follow the pointer; tweens (700–900ms, `cubic-bezier(0.32, 0.72, 0, 1)`) answer choices.
- Hit areas never move — only the drawing does. Under reduced motion springs jump to their end, ambient fields draw one still frame and colour changes are instant. Animated surfaces sleep offscreen.

### Access
- Targets are at least 44px. Focus is always visible (`gold`, or the landscape's `-hi` inside a scope). Escape closes panels; focus moves into a panel when it opens.
- Text stays above WCAG AA on every ground in both modes; the repo measures text ≥ 15.5:1, dim text ≥ 6.9:1, accents ≥ 4.56:1.
- Enter never sends while an input method is composing — Tamil keyboards confirm letters with Enter.
- The light/dark/system switch is always one press away, signed in or not.

## Iconography

- **The mark** is three bubbles at 1.00 : 0.74 : 0.56 with equal gaps (Logos). Cobalt on Cream or white; Cream on dark; Ink only for stamps. In the product it sits inside a bubble as MarkBubble — Mission Control's face, open dashed rings while asleep.
- **Tiṇai marks** (TinaiMark) are flat, solid 24-unit glyphs in `currentColor`: sun over dune, jasmine, ridge and bloom, paddy over rows, wave under the moon. They read at 14px.
- **UI icons** are inline SVG line icons on a 24 grid, 1.5–1.6 stroke, round caps and joins, `currentColor`, 16–18px — as in ModeSwitch and SoundToggle. No icon font, no emoji.
- **Hairline figures** are the illustration system: isometric line drawings that answer the pointer, stroke only, one bright mark (see Hairline).
- An app's identity is a Bubble showing the first grapheme of its Tamil name — அ for Avai, நி for Nyaya.

## Using this system

- Load the tokens, then `components/bundle.css`. Put a screen in a theme with `data-theme="dark"` or `"light"`, and in a landscape with `data-tinai="<tiṇai>"` plus the class `tinai-scope`.
- The bundle stylesheet carries the Tailwind v4 utilities the components use (`bg-night-2/80`, `text-ivory-dim`, `border-palai/50` …), the Bubble classes (`.tinai-scope`, `.hair`, `.hair-lo`, `.tray-ring`, `.mission-wake`) and the Google Fonts import for Playfair Display and Noto Serif Tamil (headings). Nunito, Baloo Thambi 2 (Tamil subset) and IBM Plex Mono are self-hosted from `fonts/`.
- The component cards are static renditions of the React 19 library in `@yazhi/bubble`; build with the real components and copy their class names exactly.
- Thiṇai mode's cards (the "Thiṇai" groups) are plain HTML with the `yz-` classes; its icons and app icons are in `assets/Icons/` and `assets/AppIcons/`.

## Not synced

- **Components are static renditions.** The React 19 library was not built or bundled; each card is markup with the library's own Tailwind classes. HairlineFigure and TinaiAmbient have guidelines but no preview (they are live canvas and kernel drawings). The seven page templates (`PAGE_COMPONENTS`) are covered only through AppFrame.
- **Fonts.** Body and Tamil text are Nunito and Baloo Thambi 2, matching `src/app/layout.tsx`. Playfair Display and Noto Serif Tamil (headings) load from Google Fonts in the previews; Nunito, Baloo Thambi 2 (Tamil subset) and IBM Plex Mono are in `fonts/`.
- **Values not carried.** `--space-section` is `clamp(5rem, 12vh, 9rem)` in code (stored at its 9rem bound); per-tiṇai motion (springs, pace, settle) is described in the sections, not as tokens; the root `--palai` is `#c25b3c` while Bubble's dark value is `#d6704f` (this system uses Bubble's).
- **Logos and written docs** live beside this folder (`../design/brand/logos/`, `../docs/`, `../themes/*/PERSONA.md`) and are not duplicated here.
- **Thiṇai mode is not in code yet.** Its tokens, `yz-` classes, icons and screens come from the Yazhi Thiṇai design system, not from `@yazhi/bubble`; the React library does not implement them yet.
- **Not brought in.** The design PDFs, theme sheets, karupporul data, Yazhi's agent definitions and the brand-kit PDF stay in the repo (`packages/bubble/design/`, `src/lib/`).
