import { TestBed } from '@angular/core/testing';
import { MotionService } from './motion.service';

describe('MotionService', () => {
  const root = document.documentElement;
  const keys = ['calme-plat', 'lagon-anime'];

  function reset(): void {
    try {
      keys.forEach((key) => localStorage.removeItem(key));
    } catch {
      // Stockage indisponible sous jsdom : rien à nettoyer.
    }
    root.classList.remove('is-still', 'motion-ok');
  }

  /** Simule un système qui demande moins d'animations (jsdom n'a pas de matchMedia). */
  function preferReducedMotion(): void {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query.includes('reduce'),
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
  }

  beforeEach(reset);

  afterEach(() => {
    reset();
    vi.unstubAllGlobals();
  });

  it('starts calm only if the visitor asked for it', () => {
    const motion = TestBed.inject(MotionService);
    TestBed.tick();

    // jsdom n'a pas de matchMedia : pas de préférence système détectée.
    expect(motion.reduced()).toBe(false);
    expect(motion.animate()).toBe(true);
    expect(motion.still()).toBe(false);
    expect(motion.calm()).toBe(false);
    expect(root.classList.contains('motion-ok')).toBe(true);
  });

  it('toggles the "Calme plat" mode and the is-still class on <html>', () => {
    const motion = TestBed.inject(MotionService);
    TestBed.tick();
    expect(root.classList.contains('is-still')).toBe(false);

    motion.toggleStill();
    TestBed.tick();
    expect(motion.still()).toBe(true);
    expect(motion.calm()).toBe(true);
    expect(root.classList.contains('is-still')).toBe(true);

    motion.toggleStill();
    TestBed.tick();
    expect(motion.still()).toBe(false);
    expect(root.classList.contains('is-still')).toBe(false);
  });

  it('restores the remembered choice', () => {
    try {
      localStorage.setItem('calme-plat', '1');
    } catch {
      return; // stockage indisponible : le cas est couvert par le try/catch du service
    }

    const motion = TestBed.inject(MotionService);
    TestBed.tick();

    expect(motion.still()).toBe(true);
    expect(root.classList.contains('is-still')).toBe(true);
  });

  it('respects the system preference, unless the visitor asks to animate the lagoon', () => {
    preferReducedMotion();
    const motion = TestBed.inject(MotionService);
    TestBed.tick();

    expect(motion.reduced()).toBe(true);
    expect(motion.animate()).toBe(false);
    expect(motion.calm()).toBe(true);
    expect(root.classList.contains('motion-ok')).toBe(false);

    motion.toggleForced();
    TestBed.tick();
    expect(motion.forced()).toBe(true);
    expect(motion.animate()).toBe(true);
    expect(motion.calm()).toBe(false);
    expect(root.classList.contains('motion-ok')).toBe(true);
  });
});
