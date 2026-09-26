import '@fontsource-variable/space-grotesk';
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import './styles/tokens.css';
import './styles/base.css';
import './styles/sections.css';

import { profile } from './data/profile';
import { renderAll } from './ui/render';
import { initScroll } from './lib/scroll';
import { hasWebGL, isLowEnd, isTouch, reducedMotion } from './lib/device';
import { initCopyEmail, initCursor, initMagnetic, initNav, initReveal, initTilt, initTyping } from './ui/effects';
import { initGithubSection } from './ui/github-section';

renderAll(profile);

initScroll(!reducedMotion && !isTouch);
initNav();
initReveal(reducedMotion);
initTyping(profile.hero.roles, reducedMotion);
initCursor();
initMagnetic();
initTilt();
initCopyEmail(profile.meta.email);
void initGithubSection(profile);

const canvas = document.getElementById('bg') as HTMLCanvasElement | null;
if (canvas && hasWebGL()) {
  // Load the 3D scene after first paint so the hero text stays the LCP element.
  requestAnimationFrame(() => {
    import('./three/scene')
      .then((m) => m.createScene(canvas, { lowEnd: isLowEnd, reduced: reducedMotion }))
      .catch(() => document.body.classList.add('no-webgl'));
  });
} else {
  document.body.classList.add('no-webgl');
}
