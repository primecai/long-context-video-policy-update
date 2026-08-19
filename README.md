# World Models with Transfusion: progress update

A 10-slide advisor update distilled from the [long-context-video-policy](https://github.com/primecai/long-context-video-policy) deck: motivation, what has been built and shown, and the plan. Open `index.html` in a browser (self-contained, offline); `long-context-video-policy-update.pdf` is the static 16:9 export (videos appear as poster frames).

Controls: arrow keys / space to advance, `O` overview, `F` fullscreen, `S` speaker view.

## Slides

1. Title
2. Today: a frozen encoder sits between language and pixels (diagram)
3. A video world model is one long interleaved chain (diagram)
4. What exists
5. Shown: a frozen encoder caps text rendering; joint training lifts the cap
6. Shown: guidance amplifies, it does not repair
7. Shown: unfreezing the language trunk does not cost image quality
8. Shown: 3 s action-conditioned video on held-out clips (four playable clips)
9. Next: video
10. Next: image, and what we claim

## Assets

- Text-rendering length curves: `assets/glyph-curve-m3-132k-grid.png` (frozen trunk, 132K), `assets/glyph-curve-m6-30k-grid.png` (joint arm, 30K)
- Guidance × word matrix: `assets/glyph-cfg-matrix-132k-4rows.png`
- Joint arm samples at 30K: `assets/m6-flagship-30k-samples.png`
- Held-out 3 s rollouts at 172K (GT · TF · AR, actions overlaid): `assets/video-dyn-*.mp4` with `-poster.png`

Reveal.js is vendored under `vendor/`. Speaker notes are in `speaker-notes.md` (about 8 min).
