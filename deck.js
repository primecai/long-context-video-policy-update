const deckReady = Reveal.initialize({
  width: 1920,
  height: 1080,
  margin: 0,
  minScale: 0.2,
  maxScale: 2,
  scrollActivationWidth: false,
  hash: true,
  history: true,
  controls: false,
  controlsLayout: 'bottom-right',
  controlsTutorial: false,
  progress: false,
  slideNumber: false,
  center: false,
  transition: 'none',
  transitionSpeed: 'fast',
  backgroundTransition: 'none',
  pdfSeparateFragments: false,
  autoAnimateEasing: 'ease-out',
  autoAnimateDuration: 0.5,
  plugins: [RevealNotes]
});

deckReady.then(() => {
  document.documentElement.classList.add('deck-ready');

  const slideVideos = [...document.querySelectorAll('.slide video')];
  if (!slideVideos.length) return;

  Reveal.on('slidechanged', ({ previousSlide }) => {
    if (!previousSlide) return;
    previousSlide.querySelectorAll('video').forEach((video) => {
      video.pause();
      if (video.readyState >= 1) video.currentTime = 0;
    });
  });
});
