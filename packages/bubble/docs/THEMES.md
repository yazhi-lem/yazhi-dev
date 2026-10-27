# Tinai themes and their personas

Sangam poetry sorts the world into five tinai. A Bubble theme gives each one
a whole environment, and a persona who lives in it.

| Part | Source | What it sets |
|---|---|---|
| Palette | `src/tinai/environments.ts` | Nine `--env-*` colours: ground, surface, hi, edge, mid, lo, accent, text, text-dim |
| Motion | `environments.ts` | A spring (k, c), an ambient pace and a settle time |
| Ambient field | `src/tinai/TinaiAmbient.tsx` | A canvas background that answers the pointer the way the landscape would |
| Figure | `src/hairline/figures` | A Hairline drawing per landscape |
| Persona | `src/tinai/personas.ts` | Name, archetype, voice, tone, interface copy, do & don't |
| Karupporul | `src/lib/karupporul.ts` | The landscape's native things (draft) |

## The personas

| Tinai | Persona | Voice | Tone |
|---|---|---|---|
| பாலை Palai | வழிப்போக்கர் The Wayfarer | Brief and exact; risk first, then one next step | steady · spare · direct |
| முல்லை Mullai | காத்திருப்பவர் The Keeper | Warm, unhurried; invites rather than instructs | patient · welcoming · encouraging |
| குறிஞ்சி Kurinji | தேடுபவர் The Seeker | Bright, curious; one door at a time, sources named | curious · light · inviting |
| மருதம் Marutham | நடுவர் The Arbiter | Plain, precise, even-handed; facts, then the rule | fair · precise · plain |
| நெய்தல் Neytal | பயணி The Voyager | Gentle, a little wistful; moves between Tamil and English | tender · bilingual · reassuring |

Each persona carries interface copy for five moments (empty, loading,
success, error, confirm) in Tamil and English, and three do's and don'ts.
Read them in `themes/<tinai>/PERSONA.md` or on the theme sheets in
`design/pdf/`. **All persona text and every Tamil line is a draft pending
native review.**

## Choosing a theme

Pick the tinai from what the screen is for, never from a colour you like:

- **Palai** — security, infrastructure, hard engineering (Kural Desk)
- **Mullai** — community, Dev Spaces, Academy, teaching (Guru)
- **Kurinji** — launches, first releases, onboarding, literature (Avai, Pulavar)
- **Marutham** — civic and legal, everyday commerce (Nyaya, Kadai)
- **Neytal** — diaspora, families far from home, language loss (Open Sangam, Yazh for parents)

Change landscape across whole sections, never inside one card.

## Using a theme

```tsx
<TinaiScope tinai="neytal">            {/* React: sets the vars, cross-fades on change */}
  <TinaiAmbient tinai="neytal" />
  …
</TinaiScope>
```

```html
<link rel="stylesheet" href="themes/all.css">   <!-- no React -->
<main data-tinai="neytal">…</main>
```

The `--env-*` colours are registered with `@property` in `styles/bubble.css`,
so switching tinai cross-fades every surface and stroke over ~900 ms (instant
under reduced motion).

## Regenerating

`themes/` is generated. Edit the sources above, then run `npm run themes`
in `packages/bubble`, and `npm run pdfs` with the site running to refresh
the theme-sheet PDFs.
