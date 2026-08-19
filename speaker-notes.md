# World Models with Transfusion (speaker notes)

Target duration: about 9 minutes 35 seconds.

## 1. World Models with Transfusion (0:15)

A short update on the unified Transfusion line: why, what has been shown, and what is next.

## 2. Today: a frozen encoder sits between language and pixels (1:00)

The premise in one picture. Left: nearly every conditional generative model runs the prompt through a frozen text encoder once, hands the generator a single fixed embedding, and the generator can never re-read the language model. That handoff is a bottleneck and a fixed prior, and it is why everyone leans on strong classifier-free guidance. Right: our model has no encoder. Language, image and video tokens live in one sequence in one model, so the generator reads the language model as deeply, and as late, as it needs. The field has been drifting this way, from CLIP to T5 to LLMs to VLMs, without isolating which change does the work; we isolate it.

## 3. The field keeps reaching deeper into the language model (0:50)

The field has been telling us this for years without saying it. Text-to-image started with CLIP, moved to T5-XXL in Imagen, combined CLIP and T5 in SD3 and FLUX, then went to full language models, Gemma in Sana, umT5 in Wan, then to entire vision-language models: Qwen-Image conditions on the last layer of Qwen2.5-VL, and MiniMax-H3 reaches into the middle of Qwen3-VL-32B, layer fifty of sixty-four, abandoning the terminal interface. Seedream and BAGEL go further and train the encoder. Every step is in the same direction: a stronger encoder, more of it, deeper access. But each of these changes the encoder, the data and the recipe at once, so the field has never isolated whether it is the interface that matters. Our model is the endpoint of that march, no encoder at all, and the ladder of arms is the controlled experiment that isolates it.

## 4. A video world model is one long interleaved chain (1:00)

The video side, also in one picture. An action-conditioned world model is frame editing: frame k is frame zero edited by k actions, and each edit has to see everything before it. The native object is a single interleaved chain: a scene caption, then frames and actions alternating, with reasoning placed right before the decision it explains. A unified model consumes exactly this, and it becomes a policy for free: next frame and next action come from the same history in the same forward pass. A split planner plus diffusion system cannot write this down. It also tells us which corpus is missing: image understanding data is mature, video understanding data is not, and this is the one place it can pay off in generation.

## 5. What exists (0:45)

What exists. A Transfusion-style model on a Qwen3-VL-8B trunk with a parallel image expert, rectified flow, packed 65K-token sequences with block-sparse attention, sharded over H200s. Three arms for the ladder the paper compares: frozen trunk with layerwise access, trainable trunk with a caption cross-entropy term and text replay, and a single-tower vanilla Transfusion, implemented and awaiting its cluster gates. Video is Solaris Minecraft at native twenty frames per second through the Wan video VAE, actions between frames, a scene caption in the prefix. Two eight-node runs are live: the joint image arm from scratch, and video on the frozen-trunk recipe from the 132K image model.

## 6. Shown: a frozen encoder caps text rendering; joint training lifts the cap (1:15)

The clearest result. Text rendering is our gauge of how much text survives the conditioning interface: thirty-two signage words, four per length from three to ten letters, fixed scene, read back by Qwen3-VL as the OCR judge. Left, the frozen arm at 132K steps: near ceiling to five letters, a knee at six, near zero by nine, with fourteen percent text-rendering data in the mix; data moved it from ten to forty-four of sixty-four but only up to that length, and guidance does not move the knee at all. Right, the trunk trainable at thirty thousand steps from scratch: 0.60 against 0.44 and the knee is gone. Not yet matched in steps, and a frozen-layerwise arm sits between the two in the paper to separate interface width from trunk plasticity, but the direction is unambiguous.

## 7. Shown: guidance amplifies, it does not repair (0:45)

The companion result on guidance. Sweep the scale on the frozen arm: words that arrived weakly are rescued, HELLO and BOOKS become correct from four and a half up; words that lost a letter at the interface stay wrong at every scale up to seven, OPEN as O-E-N, EXIT as E-X-L-T. Guidance amplifies what the conditioner delivered and cannot supply what did not arrive. That is why we read required guidance as a symptom of the bottleneck, and why the joint arm needs less of it.

## 8. Shown: unfreezing the language trunk does not cost image quality (0:40)

The joint arm itself: thirty thousand steps from scratch on eight nodes, all thirty-two long-form evaluation prompts, clean composition and attribute binding. One precise point: with caption-first images the caption cannot see the image tokens under the causal mask, so the caption cross-entropy is a language-retention objective here and the visual signal reaches the trunk through the diffusion loss. The video line is where the two genuinely co-adapt.

## 9. 3 s action-conditioned video: what works (0:50)

Video as it stands, the cases that work: held-out three-second clips, each shown as ground truth, teacher-forced and autoregressive with the executed action printed on every frame. These four are the clips where the autoregressive rollout beats a copy-last baseline by the largest margin, two to one on the first two. Large camera swings are followed, a placed slab appears where the action says, and the other agent is tracked, including when it walks into view. The implementation is audited and correct, and ablations show the model uses history and actions.

## 10. 3 s action-conditioned video: what still fails (0:40)

And the honest side: clips with fast, close-range motion, combat next to the other agent, or mining and sprinting through dense trees with large turns. Teacher-forced prediction only ties a copy-last baseline and the autoregressive rollout breaks up after one to two seconds. Same model, same sampler, so this is undertraining on dynamics, not a pipeline fault; every training window is three seconds, and longer windows are the next data change.

## 11. Next: video (0:50)

Next on video. Longer windows first: the episodes are two to three minutes and we have been training on three seconds because of a producer setting; nine and twenty-seven second documents are verified end to end and the re-encode is next, mixed as a curriculum. Then the memory tasks that sliding-window world models structurally fail. The understanding ladder, with Kimi K3 reasoning traces before each decision at the top, and an agentic harness on a vanilla model as its test-time counterpart. And the policy side: the language head is already supervised on actions; evaluating it and teacher-student imitation are the next steps.

## 12. Next: image, and what we claim (0:45)

On the image side, the matched two-billion ladder is the paper's core table: four arms differing only in the interface. What we have not tried is architecture: our expert is a full Mixture-of-Transformers, and a recent controlled study in the same Transfusion-plus-flow setting finds that splitting only the feed-forward layers while sharing attention gives the synergy, that splitting attention collapses it, and that early joint training beats late sequential; our video line is late and sequential by construction, so a split-FFN arm and a joint-from-early arm are both cheap. The five claims: encoder-free, unified, less guidance, interleaved chains, and the understanding corpus as the missing piece of video generation.
