# Encoder-Free Unified Transfusion: progress update (speaker notes)

Target duration: about 8 minutes 40 seconds.

## 1. Encoder-Free Unified Transfusion — 0:15

A short update on the unified Transfusion line: the motivation in two slides, what has been built and shown, and the plan.

## 2. Motivation: remove the encoder bottleneck — 1:00

The premise. Nearly every conditional generative model today runs the prompt through a frozen encoder once and hands the generator a fixed embedding; the generator can never re-read the language model. Our bet is that this handoff, not model size, is the bottleneck: it imposes a fixed prior and it is why everyone needs strong guidance. The field already senses this, moving from CLIP to T5 to LLMs to full VLMs, tapping deeper layers, unfreezing encoders, but always changing many things at once. We build the encoder-free version and measure it with matched arms.

## 3. Motivation: one stream for video, actions and reasoning — 1:00

The second motivation is the video side. An action-conditioned world model is an image editor applied k times, and each edit must see everything before it. The natural architecture is a single long interleaved chain, frames, actions and reasoning together, which is exactly what a unified Transfusion model consumes and what split planner-plus-diffusion systems cannot express. It also makes the model a policy for free: next frame and next action come from the same history in the same pass. And it points at the corpus we think the field is missing: image understanding data is mature, video understanding data is not, and a unified model is the one place that data can pay off in generation.

## 4. What we built — 1:00

What exists. A Transfusion-style model on a Qwen3-VL-8B trunk with a parallel image expert, rectified flow, packed 65K-token sequences with block-sparse attention, sharded across H200s. Three arms form the ladder the paper compares: a frozen trunk with layerwise access, a trainable trunk with a caption cross-entropy term and text replay, and a single-tower vanilla Transfusion that is implemented and awaiting its cluster gates. On the video side, Solaris Minecraft episodes at native twenty frames per second through the true Wan video VAE, three-second windows of sixteen latent chunks with logged actions between frames and a scene caption in the prefix. Two eight-node runs are live: the joint image arm from scratch, and video on the frozen-trunk recipe initialized from the 132K image model.

## 5. Shown: frozen text encoders cannot render long text — 1:15

The clearest result so far. Text rendering is our gauge of how much text survives the conditioning interface: thirty-two signage words, four per length from three to ten letters, in a fixed scene, read back by Qwen3-VL as the OCR judge. Left, the frozen-trunk arm at 132K steps: near ceiling to five letters, a knee at six, near zero by nine, and that is with fourteen percent text-rendering data in the mix. Guidance does not move the knee; data moved the frozen model from ten to forty-four out of sixty-four but only up to that length. Right, the joint arm with the trunk trainable at thirty thousand steps from scratch: exact match 0.60 against 0.44, flat between sixty and eighty percent through nine letters. The comparison is not yet matched in steps, and the paper has a frozen-layerwise arm between these two to separate interface width from trunk plasticity, but the direction is unambiguous.

## 6. Shown: guidance amplifies, it does not repair — 0:45

The companion result on guidance. Sweeping the guidance scale on the frozen arm: words that arrived weakly, HELLO and BOOKS, are rescued by strong guidance; words that lost a letter at the interface, OPEN as O-E-N and EXIT as E-X-L-T, stay wrong at every scale up to seven. Guidance amplifies what the conditioning delivered and cannot supply what did not arrive. That is why we treat required guidance as a symptom of the bottleneck rather than a knob, and why the joint arm needs less of it.

## 7. Shown: the joint arm learns images at least as fast — 0:40

The joint arm itself, thirty thousand steps from scratch on eight nodes: all thirty-two long-form evaluation prompts, clean composition and attribute binding, no interference between the language objective and generation. Since caption-first images cannot see the image tokens under the causal text mask, the caption cross-entropy is a language-retention objective here; the visual signal reaches the trunk through the diffusion loss. The video line is where the two genuinely co-adapt.

## 8. Shown: 3 s action-conditioned video on held-out clips — 1:00

Video as it stands. Held-out three-second clips chosen for action diversity: another player in view, mining, jumping, camera swings. Each panel is ground truth, teacher-forced and autoregressive with the executed action printed on every frame. Structure holds; the model tracks the other agent, tilts to the sky on jumps and re-grounds. The honest number: on fast motion, teacher-forced prediction still only ties a copy-last baseline. We audited the implementation and it is correct; ablations show the model uses history and actions. It is undertrained for dynamics, and every training window is three seconds, which is the next data change.

## 9. Plan: video — 1:00

The video plan. First, longer windows: the episodes are two to three minutes and we have been training on three seconds because of a producer setting; the pipeline for nine and twenty-seven second contiguous documents is verified and the re-encode is next, mixed as a curriculum. Second, a Self Forcing stage so autoregressive rollouts stop drifting, then the memory tasks the sliding-window family cannot pass. Third, the understanding ladder, with Kimi K3 reasoning traces at the top and an agentic harness on a vanilla model as the test-time counterpart. Fourth, the policy side: the language head is already supervised on actions; evaluating it and setting up teacher-student imitation are the next steps.

## 10. Plan: image, and open questions — 0:45

On the image side, the matched two-billion ladder is the paper's core table: four arms, same data and compute, differing only in the interface. What we have not tried is architecture: our expert is a full Mixture-of-Transformers, and a recent controlled study in the same Transfusion-plus-flow setting finds that splitting only the feed-forward layers while sharing attention gives the synergy, that splitting attention collapses it, and that early joint training beats late sequential training. Our video line is late and sequential by construction, so a joint-from-early arm and a split-FFN arm are both cheap and worth running. The five claims to defend: encoder-free, unified, less guidance, interleaved chains, and the understanding corpus.
