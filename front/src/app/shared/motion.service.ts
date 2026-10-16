import { DestroyRef, Injectable, Signal, computed, effect, inject, signal } from '@angular/core';

/** Clé de mémorisation du mode « Calme plat ». */
const STILL_KEY = 'calme-plat';

/** Clé de mémorisation du choix « Animer le lagon ». Lue aussi par index.html. */
const FORCED_KEY = 'lagon-anime';

/**
 * État du mouvement sur le site.
 *
 * - `reduced` suit la préférence système `prefers-reduced-motion` ;
 * - `forced` est l'inverse, choisi depuis le header quand le système demande
 *   moins d'animations : le visiteur veut quand même voir le lagon bouger ;
 * - `animate` résume les deux : les animations sont permises ;
 * - `still` est le mode « Calme plat » choisi depuis le header (WCAG 2.2.2) ;
 * - `calm` : aucune animation décorative ne doit tourner.
 *
 * Le service pose sur <html> la classe `motion-ok` (lue par le mixin
 * `motion-safe` et le reset) et la classe `is-still` (règles de pause
 * globales et mixin `when-still`). Les deux choix sont mémorisés.
 */
@Injectable({ providedIn: 'root' })
export class MotionService {
  private readonly reducedState = signal(false);
  private readonly stillState = signal(readFlag(STILL_KEY));
  private readonly forcedState = signal(readFlag(FORCED_KEY));

  /** prefers-reduced-motion: reduce (suivi en direct, false sans matchMedia). */
  readonly reduced: Signal<boolean> = this.reducedState.asReadonly();

  /** Mode « Calme plat » choisi sur le site, mémorisé sous la clé 'calme-plat'. */
  readonly still: Signal<boolean> = this.stillState.asReadonly();

  /** « Animer le lagon » choisi malgré la préférence système, mémorisé sous 'lagon-anime'. */
  readonly forced: Signal<boolean> = this.forcedState.asReadonly();

  /** Vrai si les animations sont permises (pas de préférence, ou choix explicite). */
  readonly animate: Signal<boolean> = computed(() => !this.reduced() || this.forced());

  /** Vrai si aucune animation décorative ne doit tourner. */
  readonly calm: Signal<boolean> = computed(() => !this.animate() || this.still());

  constructor() {
    this.watchReducedMotion();

    // Les classes sur <html> et la mémorisation suivent toujours l'état.
    effect(() => {
      const still = this.still();
      const forced = this.forced();
      const animate = this.animate();

      if (typeof document !== 'undefined') {
        const root = document.documentElement.classList;
        root.toggle('is-still', still);
        root.toggle('motion-ok', animate);
      }

      writeFlag(STILL_KEY, still);
      writeFlag(FORCED_KEY, forced);
    });
  }

  /** Active ou coupe le mode « Calme plat ». */
  toggleStill(): void {
    this.stillState.update((still) => !still);
  }

  /** Active ou coupe « Animer le lagon » (utile seulement sous `reduced`). */
  toggleForced(): void {
    const forced = !this.forced();
    this.forcedState.set(forced);
    // Réveiller le lagon lève aussi un « Calme plat » resté mémorisé.
    if (forced) {
      this.stillState.set(false);
    }
  }

  /**
   * Bouton du header : sans préférence système, il bascule « Calme plat » ;
   * sous `prefers-reduced-motion: reduce`, il bascule « Animer le lagon ».
   */
  toggleChoice(): void {
    if (this.reduced()) {
      this.toggleForced();
    } else {
      this.toggleStill();
    }
  }

  private watchReducedMotion(): void {
    if (typeof matchMedia !== 'function') {
      return;
    }

    const query = matchMedia('(prefers-reduced-motion: reduce)');
    this.reducedState.set(query.matches);

    const onChange = (event: MediaQueryListEvent) => this.reducedState.set(event.matches);
    query.addEventListener?.('change', onChange);
    inject(DestroyRef).onDestroy(() => query.removeEventListener?.('change', onChange));
  }
}

/** Lecture initiale d'un choix mémorisé, sans jamais lever d'erreur. */
function readFlag(key: string): boolean {
  try {
    return localStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

/** Mémorise un choix ; stockage bloqué (navigation privée) : le choix vaut pour la visite. */
function writeFlag(key: string, value: boolean): void {
  try {
    localStorage.setItem(key, value ? '1' : '0');
  } catch {
    // Rien à faire : l'état reste valable jusqu'au rechargement.
  }
}
