import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { InViewDirective } from '../../shared/in-view.directive';
import { MotionService } from '../../shared/motion.service';

/** Distance (px) en deçà de laquelle le banc s'écarte du curseur. */
const FLEE_RADIUS = 180;
/** Écart maximal (px) du banc quand le curseur est en plein dedans. */
const FLEE_MAX = 60;
/** Délai (ms) après lequel un curseur immobile ne fait plus peur. */
const CALM_DOWN = 1500;
/** Durée (ms) du sursaut sur écran tactile (keyframes `startle`). */
const STARTLE = 1200;

/**
 * Intermède du lagon, entre « Projets » et « Compétences » : un banc de
 * demoiselles qui s'écarte du curseur.
 *
 * - Souris : le banc fuit le pointeur, puis se reforme. L'écoute du
 *   pointeur n'existe que si le banc est à l'écran et que rien n'est figé
 *   (mouvement réduit ou « Calme plat ») ; une seule rAF à la fois.
 * - Écran tactile : le banc sursaute une fois, à sa première apparition.
 *
 * Décor pur : masqué aux lecteurs d'écran, sans pointeur, mis en pause hors
 * écran grâce à InViewDirective.
 */
@Component({
  selector: 'app-fish-school',
  templateUrl: './fish-school.html',
  styleUrl: './fish-school.scss',
  hostDirectives: [InViewDirective],
  host: { class: 'decor interlude', 'aria-hidden': 'true' },
})
export class FishSchool {
  private readonly view = inject(InViewDirective, { self: true });
  private readonly motion = inject(MotionService);

  /** Le banc tel qu'il nage, sans l'écart de fuite : sert de référence. */
  private readonly mover = viewChild.required<ElementRef<HTMLElement>>('mover');
  /** L'enveloppe qui porte l'écart de fuite (--fx, --fy). */
  private readonly flee = viewChild.required<ElementRef<HTMLElement>>('flee');

  /** Pointeur fin (souris) : vrai, faux, ou inconnu avant le premier rendu. */
  private readonly finePointer = signal<boolean | null>(null);

  protected readonly fleeing = signal(false);
  protected readonly startled = signal(false);

  private pointerX = 0;
  private pointerY = 0;
  private frame = 0;
  private calmTimer?: ReturnType<typeof setTimeout>;
  private startleTimer?: ReturnType<typeof setTimeout>;
  private startleDone = false;

  constructor() {
    afterNextRender(() => {
      this.finePointer.set(
        typeof matchMedia === 'function' && matchMedia('(hover: hover) and (pointer: fine)').matches,
      );
    });

    // Souris : on n'écoute le pointeur que lorsque cela peut servir.
    effect((onCleanup) => {
      if (this.finePointer() !== true || !this.view.inView() || this.motion.calm()) {
        untracked(() => this.regroup());
        return;
      }

      const onMove = (event: PointerEvent) => {
        this.pointerX = event.clientX;
        this.pointerY = event.clientY;
        if (this.frame) {
          return;
        }
        if (typeof requestAnimationFrame !== 'function') {
          this.react();
          return;
        }
        this.frame = requestAnimationFrame(() => {
          this.frame = 0;
          this.react();
        });
      };

      window.addEventListener('pointermove', onMove, { passive: true });
      onCleanup(() => {
        window.removeEventListener('pointermove', onMove);
        if (this.frame && typeof cancelAnimationFrame === 'function') {
          cancelAnimationFrame(this.frame);
        }
        this.frame = 0;
      });
    });

    // Écran tactile : un sursaut, une seule fois, à la première apparition.
    effect(() => {
      if (this.startleDone || this.finePointer() !== false || !this.view.seen()) {
        return;
      }
      this.startleDone = true;
      if (untracked(() => this.motion.calm())) {
        return;
      }
      this.startled.set(true);
      this.startleTimer = setTimeout(() => this.startled.set(false), STARTLE);
    });

    inject(DestroyRef).onDestroy(() => {
      clearTimeout(this.calmTimer);
      clearTimeout(this.startleTimer);
    });
  }

  /** Une lecture de mise en page, puis une écriture. */
  private react(): void {
    const box = this.mover().nativeElement.getBoundingClientRect();
    const dx = box.left + box.width / 2 - this.pointerX;
    const dy = box.top + box.height / 2 - this.pointerY;
    const distance = Math.hypot(dx, dy);

    if (distance >= FLEE_RADIUS) {
      this.regroup();
      return;
    }

    // Plus le curseur est proche, plus l'écart est grand (FLEE_MAX au centre)
    const k = (((FLEE_RADIUS - distance) / FLEE_RADIUS) * FLEE_MAX) / Math.max(distance, 1);
    this.shift(dx * k, dy * k);
    this.fleeing.set(true);

    // Un curseur qui ne bouge plus finit par ne plus effrayer personne
    clearTimeout(this.calmTimer);
    this.calmTimer = setTimeout(() => this.regroup(), CALM_DOWN);
  }

  /** Le banc revient à sa place (transition lente, 1,2 s). */
  private regroup(): void {
    clearTimeout(this.calmTimer);
    if (!this.fleeing()) {
      return;
    }
    this.shift(0, 0);
    this.fleeing.set(false);
  }

  private shift(x: number, y: number): void {
    const style = this.flee().nativeElement.style;
    style.setProperty('--fx', `${x.toFixed(1)}px`);
    style.setProperty('--fy', `${y.toFixed(1)}px`);
  }
}
