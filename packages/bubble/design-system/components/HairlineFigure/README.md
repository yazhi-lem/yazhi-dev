# HairlineFigure

Hosts one Hairline figure: an isometric line drawing that answers the pointer, built on the vendored Hairline kernel (Lucas Marques, MIT).

**The consumer provides** `figure` (a `HairlineFigureDef`, one of `TINAI_FIGURES` or `SANGAM_OBJECTS`), optional `intensity` (0 subtle … 1 strong), `play` (walk the figure's tour until a real pointer arrives), `onRead(text)`, `caption` (show the read-out), `sound` (offer the yazh's voice), `className`.

Strokes come from the nearest `--hairline-*` properties, which a TinaiScope sets from `-hi`, `-edge`, `-mid`, `-lo` and `-ground`, so a figure always sits in its landscape's ink.

Figures: cairn (Palai), grove (Mullai), peaks (Kurinji), paddy (Marutham), tide (Neytal); objects yazh, parai, vilakku, olai. Keep the ten Hairline rules (see the Hairline section). No preview here: a figure is the kernel's live drawing. Source: `packages/bubble/src/hairline/`.
