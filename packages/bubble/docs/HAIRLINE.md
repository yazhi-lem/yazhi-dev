# Hairline figures

Isometric line drawings that answer the pointer, built on the Hairline
kernel by Lucas Marques (MIT, <https://github.com/lucasmarkes/hairline>),
vendored unchanged in `src/hairline/kernel.js` with its licence in
`src/hairline/LICENSE-hairline`. `HairlineFigure` hosts a figure in React.

## The figures

| Figure | For | The pointer… | The dial |
|---|---|---|---|
| cairn | Palai | picks a stone by height; the stones above lift away | gap |
| grove | Mullai | grows the nearest trees toward it | reach |
| peaks | Kurinji | raises a peak and its neighbours; the kurinji bloom moves to it | reach |
| paddy | Marutham | floods a plot; neighbours follow, nearest first | stagger |
| tide | Neytal | brings a swell along the moorings | swell reach |
| yazh | object | plucks a string; neighbours sound in sympathy | sympathy |
| parai | object | strikes the drum skin; rings run out | ring speed |
| vilakku | object | lights the nearest wick; the flame passes round | catch delay |
| olai | object | picks a leaf; the leaves above fan open | fan spread |

## The ten rules

1. Hit areas never move: test against the rest pose.
2. Stagger by distance from where the change started.
3. Clamp reach; let falloff keep a floor.
4. Stroke is the only highlight: no fills, no glows.
5. Design the rest pose; one bright mark.
6. Honest construction, painted back to front.
7. Loops sleep offscreen.
8. Two clocks: a tween for choices, springs for the pointer.
9. Rounded solids are a silhouette and one crease.
10. No words in the figure; the read-out names the part.

The read-out is announced to screen readers only when a person moves over a
figure, never while it plays its own tour.
