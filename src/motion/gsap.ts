import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, ScrambleTextPlugin);
gsap.defaults({ ease: 'power3.out', duration: 1 });

export { gsap, ScrollTrigger, SplitText, useGSAP };

/** Any screen with motion allowed. */
export const MOTION = '(prefers-reduced-motion: no-preference)';
/** Wide screens with motion allowed: pins and parallax live here only. */
export const DESKTOP = '(min-width: 900px) and (prefers-reduced-motion: no-preference)';

/*
 * Text motion vocabulary (after ui.fearnot.tw's catalogue). Each one has one job and one
 * place; sections do not share them.
 *   inkFill    33 空心字   titles: ink floods the outline in the wind's direction
 *   flap       25 翻牌     the live board: a status flips through characters to its value
 *   flowRibbon 13 緞帶     the footer ribbon
 *   stamp      03 印章     互動平台: the three ways to collect a stamp
 * The footer's 重複波浪 (11) is CSS (shell.css); the 直書三層 columns (15), 圖案遮罩 window (35), 巨字滑過
 * scroll (09) and 上下裂開 swap (32) live with their sections in HomePage.
 */

/** Ink floods an `<Ink>` title left to right, character by character. */
export function inkFill(el: Element, scroll = true) {
  const fill = el.querySelector('.ink-fill');
  if (!fill) return;
  const split = SplitText.create(fill, { type: 'chars', aria: 'none' });
  return gsap.fromTo(
    split.chars,
    { clipPath: 'inset(0% 100% 0% 0%)' },
    {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 1.1,
      ease: 'power2.inOut',
      stagger: 0.12,
      scrollTrigger: scroll ? { trigger: el, start: 'top 82%', once: true } : undefined,
    },
  );
}

/**
 * 緞帶: slide a `<Ribbon>`'s text along its wave by exactly one repeat of the phrase per
 * loop, so the loop is seamless.
 */
export function flowRibbon(svg: Element, repeats: number) {
  const path = svg.querySelector<SVGTextPathElement>('textPath');
  if (!path) return;
  const unit = path.getComputedTextLength() / repeats;
  return gsap.fromTo(
    path,
    { attr: { startOffset: 0 } },
    { attr: { startOffset: -unit }, duration: 16, ease: 'none', repeat: -1 },
  );
}

const FLAP_CHARS = '公告待布籌備中已期限名單見官方社群說明會招募商店祭典';

/** A split-flap cell: the text riffles through characters before settling. */
export function flap(el: HTMLElement, delay = 0) {
  const text = el.textContent ?? '';
  return gsap.to(el, {
    duration: 0.9 + text.length * 0.05,
    delay,
    ease: 'none',
    scrambleText: { text, chars: FLAP_CHARS, speed: 0.6, revealDelay: 0.25 },
  });
}

/** 印章 (ui.fearnot.tw 03): seals pressed onto the page one by one as they arrive. */
export function stamp(seals: Element[], trigger: Element) {
  return gsap.from(seals, {
    scale: 1.45,
    rotation: (i) => (i % 2 ? 8 : -8),
    autoAlpha: 0,
    duration: 0.4,
    ease: 'power4.in',
    stagger: 0.28,
    scrollTrigger: { trigger, start: 'top 80%', once: true },
  });
}
