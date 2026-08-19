# Encoder-Free Unified Transfusion: progress update

A 10-slide advisor update distilled from the [long-context-video-policy](https://github.com/primecai/long-context-video-policy) deck: motivation, what has been built and shown, and the plan. Open `index.html` in a browser (self-contained, offline); `long-context-video-policy-update.pdf` is the static 16:9 export (videos appear as poster frames).

Controls: arrow keys / space to advance, `O` overview, `F` fullscreen, `S` speaker view.

## Slides

1. Title
2. Motivation: remove the encoder bottleneck
3. Motivation: one stream for video, actions and reasoning
4. What we built
5. Shown: frozen text encoders cannot render long text
6. Shown: guidance amplifies, it does not repair
7. Shown: the joint arm learns images at least as fast
8. Shown: 3 s action-conditioned video on held-out clips (four playable clips)
9. Plan: video
10. Plan: image, and open questions

## Assets

- Text-rendering length curves: `assets/glyph-curve-m3-132k-grid.png` (frozen trunk, 132K), `assets/glyph-curve-m6-30k-grid.png` (joint arm, 30K)
- Guidance × word matrix: `assets/glyph-cfg-matrix-132k-4rows.png`
- Joint arm samples at 30K: `assets/m6-flagship-30k-samples.png`
- Held-out 3 s rollouts at 172K (GT · TF · AR, actions overlaid): `assets/video-dyn-*.mp4` with `-poster.png`

Reveal.js is vendored under `vendor/`. Speaker notes are in `speaker-notes.md` (about 8 min).
