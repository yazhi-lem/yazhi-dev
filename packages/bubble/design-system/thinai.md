# Thiṇai mode

Thiṇai mode is Bubble made plainer and easier to use, merged in from the Yazhi Thiṇai design system (Nov 2026). Bubble's rules stand everywhere else; Thiṇai's rules below apply only on screens that opt in. It covers Guru, Nyaya, Kural and the children's products. You get pastel landscapes, big words, a left-hand rail of word labels, and two buttons that mean what a toy's buttons mean: **green goes, red stops**. Everything else from Bubble carries over: apps as bubbles, Mission Control as a bordered flat bubble, a citation for every claim, an honest "I don't know", and a confirm step before anything changes. A custom line-icon set sits beside every word.

## Principles

1. **Words lead.** Every screen is read, not decoded. Labels are words. Icons and colour never carry meaning on their own. Reading text starts at 22px in English and 24px in Tamil.
2. **Two buttons, like a gadget.** At most one green and one red per screen. Green sits on the right and moves forward: send, save, approve, next. Red sits on the left and stops or backs out: no, discard, hand over, stop. Everything else is a soft button.
3. **One screen, one job.** A heading, one card or one conversation, and one go/stop pair.
4. **A source, or "I don't know".** Every claim carries a citation chip and a source card. When no stored source supports an answer, the app says so and offers the next step (from Bubble).
5. **Nothing changes without a yes.** Sending a reply, recording a refund or saving a draft goes through a ConfirmGate that names the action, what it affects and how to undo it.
6. **The person sets the size and the look.** Text size, theme, motion and focus ring live in every app's Settings. Every size in this system is in rem, so the whole interface grows with the person's setting and with browser zoom.
7. **Tamil first.** Tamil sits above English, larger and looser. The language switch keeps languages strictly apart unless "Both" is chosen. Nyaya adds Telugu.

## What changed from Bubble, and why

| Bubble | Thiṇai | Why |
|---|---|---|
| Ink-and-cream ground; landscapes as dark/light environments | Pastel thiṇai grounds plus **High contrast** and **Night** themes | Calmer by default; two themes for people who need more contrast or less glare |
| Gold primary button, one action colour | **Green go / red stop** pair, each with a word and a glyph | One rule for every app: right is forward, left is back |
| 10px mono labels, 14px UI text | Smallest text 13px (draft tag), body 18px+, labels 15px+ | Readable by older eyes and on cheap phones |
| 44px targets | 56px targets, 72px for the main pair | Thumbs, not cursors |
| Lit-sphere bubbles; tray of unnamed bubbles | Flat pastel bubbles, **always shown with their name** | First graphemes collide (Guru and Kural are both கு) |
| Hairline borders, no depth | One flat ledge under buttons and cards | Shows what can be pressed |
| Inline line icons, no set of its own | A 37-icon Yazhi set plus seven theme marks, always beside a word | Faster scanning without giving up words |
| Light/dark switch beside Mission Control | Full Settings page per app: text size, look, motion, focus, language | Accessibility is a setting the person owns |

Kept as-is: the mark and its rules, Mission Control as Bubble drew it (gold ring, 14% wash, the mark at 0.56; dashed and open while asleep), the tiṇai-to-app mapping, citation and source cards, "I don't know", ConfirmGate, the draft tag, Enter never sending while a Tamil input method is composing, and never letter-spacing Tamil.

## Content fundamentals

- Short sentences. One idea per line. Sentence case.
- Verbs on buttons, one or two words in each language: அனுப்பு · Send, சேமி · Save, வேண்டாம் · No, நிறுத்து · Stop.
- Placeholders look like placeholders: "[Sample Act name], [year]", "₹ —", "[#order]". Screens using them carry a "Sample data" notice.
- Nyaya shows "Information, not advice" under every answer. Kural says "No money moves through Yazhi" wherever money is mentioned. Guru says "Not in these sources" rather than guess.
- Praise warmly. Red never scolds: a wrong quiz answer is "அருகில்! · Close!", never "Wrong".
- **All Tamil (and Telugu) here is a draft** until a Pulavar or native reviewer signs it off. Mark it with the draft tag `† draft`. The app names carry † until then, as in the PRDs.

## Visual foundations

### Themes

Opt a screen in on its root: `class="yz-root" data-theme="light" data-tn="<landscape>"`, where the landscape is `mullai`, `kurinji`, `marutham`, `neithal`, `paalai` or `contrast`. Night is Bubble's dark theme: `data-theme="dark" data-tn="night"`. Put `data-theme` and `data-tn` on the same element. A landscape changes `tn-surface`, `tn-panel`, `tn-tint`, `tn-tint-strong`, `tn-ink`, `tn-ink-muted`, `tn-focus` and `tn-mark`. Go, stop, spacing, radii and type never change. All Thiṇai colour tokens carry the `tn-` prefix in this system.

| Theme | Use |
|---|---|
| Kurinji · lavender | Launches, onboarding, literature |
| Mullai · mint (default) | Teaching and community: **Guru** |
| Marutham · butter | Civic, legal, commerce: **Nyaya** |
| Neithal · sky | Diaspora, families, songs |
| Paalai · peach | The hard-working counter: **Kural** |
| High contrast · தெளிவு | Pure white and black, grey ledges, for low vision or bright sun |
| Night · இரவு | Near-black green with light text, for evenings and glare |

An app opens in its own thiṇai. The person can pick any theme in Settings, and the choice wins.

### Go and stop

`tn-go` (#13693a) and `tn-stop` (#c8362e) are the only strong colours. White labels pass 4.5:1 on both. Red and green are close in lightness, so each button always carries **a word, an icon** (send, check for go; cross, stop for stop) **and a fixed side** (stop left, go right). Their soft tints, `tn-go-soft` and `tn-stop-soft`, carry status messages, with text in `tn-go-ink` and `tn-stop-ink`. At night the soft tints turn deep and the inks turn light, so a refusal never becomes a bright pink block on a dark screen.

### Bubbles

Each app is a flat pastel disc in its identity colour: `tn-app-guru`, `tn-app-nyaya`, `tn-app-kural`. Its first Tamil grapheme is set in `tn-on-pastel` ink. A bubble is always shown with its name beside or under it. The Yazhi mark lives in **Mission Control**: Bubble's bordered flat bubble, with a `tn-mission` gold ring, a 14% wash and the mark in `tn-ink`. It is the brand at the top of the nav and the person's controls at the start of the composer.

### Shape and depth

Toy-soft corners: `radius-lg` 28px for cards, groups and the rail, `radius-md` 20px for nav items, `radius-pill` for buttons, switches and chips. Depth is one flat **ledge**: `press-depth` 5px under buttons, 4px under cards. Pressing drops the button onto its ledge.

### Type

- **Baloo Thambi 2** for display, buttons and all Tamil. **Nunito** for English. Both are self-hosted from `fonts/` (Nunito 400/600/700, Baloo Thambi 2 400/600 Tamil subset); `bundle.css` also loads the 800 weights from Google Fonts.
- Styles in rem: `tn-display` 2.75, `tn-title` 1.875, `tn-button` 1.25, `tn-body-lg` 1.375, `tn-body` 1.125, `tn-nav` 1.125, `tn-caption` .9375, `tn-tamil-lg` 1.5, `tn-tamil` 1.1875. The rounded family is `--font-rounded`.
- Tamil line height 1.6 or more. Never letter-space Tamil, and cut it by grapheme.

## Accessibility

- **Targets:** at least `tap-min` (56px); the main pair `tap-big` (72px); citation chips 32px tall.
- **Contrast:** `tn-ink` and `tn-ink-muted` pass 4.5:1 on `tn-surface`, `tn-panel`, `tn-tint` and `tn-tint-strong` in all seven themes. Focus rings pass 3:1.
- **Text size:** the Settings stepper sets the root font size (100%, 112.5%, 125%, 137.5%), and everything scales with it.
- **Switches say their state in words** ("ஆம் · On" / "இல்லை · Off"), not only by knob position. The off track has a `tn-control-edge` outline and knob, and the on track is `tn-switch-on`, so both are 3:1+ in every theme. Locked safeguards keep full colour and add a lock icon with the reason. They are never faded.
- **Selection never relies on a pale fill.** The current nav page, current app, chosen option and chosen theme all get a 2–3px `tn-state` ring (4.5:1+).
- **Audited:** every card in this system passes axe-core's colour-contrast check in all seven themes.
- **Motion:** `prefers-reduced-motion` turns off every transition; Settings can force it.
- **Screen readers:** conversations are `role="log"`, notices `role="status"`, gates `role="dialog"`, glyphs `aria-hidden`. Bubbles carry the app name as their label.
- **Keyboard:** a 3px `tn-focus` ring at 2–4px offset on everything. Enter never sends while an input method is composing.

## Iconography and assets

- **Logos:** the Yazhi mark, wordmarks and lockups: the same Logos group as Bubble.
- **App icons:** upload-ready PNGs at 1024 and 512 for Guru, Nyaya and Kural, plus SVG sources. See the AppIcons group.
- **Icons:** 37 line icons on a 24 grid at 1.75 stroke with round ends, plus seven solid theme marks: hill and bloom, jasmine, paddy, moon over waves, sun over dune, contrast, night. They are drawn for Yazhi, never stand without a word, and take `currentColor`. See the Icons card and asset group.

## Components and screens

- **Bubble UI:** ThinaiMissionControl, AppBubble, Conversation, ThinaiComposer, Notice, ThinaiConfirmGate
- **Foundations:** Icons, ThinaiThemes
- **Controls:** Button, LanguageToggle, SettingsControls
- **Layout:** SideNav, Card, AppShell
- **Screens:** four drafts per app, each with a Settings page:
  - Guru: answer, not in sources, quiz (Night)
  - Nyaya: answer, refusal (High contrast), document explainer
  - Kural: triage, customer chat with confirm gate, knowledge base

All of it is plain HTML with the `yz-` classes, which live in the Thiṇai part of `components/bundle.css`. There is no JavaScript bundle. The cards sit under the "Thiṇai" groups, beside Bubble's own.
