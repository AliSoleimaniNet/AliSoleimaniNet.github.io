import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export type ScrollListener = (progress: number, scroll: number) => void;
const listeners = new Set<ScrollListener>();
let lenis: Lenis | null = null;

export function onScroll(fn: ScrollListener) {
  listeners.add(fn);
}

function emit(progress: number, scroll: number) {
  for (const fn of listeners) fn(progress, scroll);
}

function nativeProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? window.scrollY / max : 0;
}

export function initScroll(smooth: boolean): Lenis | null {
  if (smooth) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on('scroll', (l: Lenis) => {
      ScrollTrigger.update();
      emit(l.progress, l.scroll);
    });
    gsap.ticker.add((t) => lenis!.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    return lenis;
  }
  const handler = () => emit(nativeProgress(), window.scrollY);
  window.addEventListener('scroll', handler, { passive: true });
  handler();
  return null;
}

export function scrollTo(target: string | HTMLElement) {
  if (lenis) lenis.scrollTo(target, { offset: -20, duration: 1.4 });
  else (typeof target === 'string' ? document.querySelector(target) : target)?.scrollIntoView({ behavior: 'smooth' });
}

export { gsap, ScrollTrigger };
