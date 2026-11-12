# Notice

Plain panels that tell the person something important: I don't know, a disclaimer, sample data, saved. Plus the draft tag for unreviewed Tamil.

## Variants

| Class | Use | Example |
|---|---|---|
| `yz-notice yz-notice--stop` | Can't answer, refusal | "✕ தெரியவில்லை · I don't know", Nyaya's "எனக்கு உறுதியாகத் தெரியவில்லை · I'm not sure", Guru's "இந்நூல்களில் இல்லை · Not in these sources" |
| `yz-notice` | Standing information | "Information, not advice", "Sample data", "Nothing is sent until you say yes" |
| `yz-notice yz-notice--go` | Done | "✓ நன்று! · Saved" |
| `yz-draft` | Inline tag on Tamil or Telugu not yet reviewed | "† draft · native review" |

## Rules

- A refusal always offers the next step: a green button (Call legal aid, Add a page) and a soft one.
- Use `role="status"` for things that appear in response to an action, and `role="note"` for standing text.
- Lead every notice with an icon (unknown, info, verified, scales, lock, sample) so the meaning isn't carried by colour alone. Text uses `tn-stop-ink` and `tn-go-ink` on the soft tints, which pass in every theme, Night included.
