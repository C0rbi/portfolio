import { Component, DestroyRef, ElementRef, afterNextRender, inject, signal } from '@angular/core';
import { InViewDirective } from '../../shared/in-view.directive';

/**
 * Intermède du sable, entre « Profil » et « Parcours » : des traces de pas
 * qui s'impriment au fil du défilement, un crabe fantôme qui file vers son
 * terrier, des coquillages et une étoile de mer.
 *
 * Le mouvement est en CSS :
 * - les traces suivent une `view-timeline` (Chrome), ou apparaissent en
 *   cascade à la première vue grâce à la classe `is-seen` (Firefox) ;
 * - hors écran, les boucles sont en pause (`is-inview`, voir _animations).
 *
 * Seul le départ du crabe passe par le JS : l'hôte, de hauteur nulle, est
 * « vu » bien avant que la scène n'entre à l'écran (marge de 20 %). Le crabe
 * attend donc que la scène soit vraiment visible, puis ne court qu'une fois.
 *
 * Masqué aux lecteurs d'écran et sans pointeur (classe globale `decor`).
 */
@Component({
  selector: 'app-sand-steps',
  templateUrl: './sand-steps.html',
  styleUrl: './sand-steps.scss',
  hostDirectives: [InViewDirective],
  host: {
    class: 'decor interlude',
    'aria-hidden': 'true',
    '[class.crab-go]': 'crabGo()',
  },
})
export class SandSteps {
  /** Passe à vrai (une seule fois) quand la scène est bien à l'écran. */
  protected readonly crabGo = signal(false);

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const stage = host.nativeElement.querySelector('.steps');

      // Sans IntersectionObserver (jsdom), le crabe part tout de suite.
      if (typeof IntersectionObserver === 'undefined' || !stage) {
        this.crabGo.set(true);
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            this.crabGo.set(true);
            observer.disconnect();
          }
        },
        { threshold: 0.6 },
      );

      observer.observe(stage);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
