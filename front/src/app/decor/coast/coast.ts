import { Component, DestroyRef, inject, signal } from '@angular/core';
import { InViewDirective } from '../../shared/in-view.directive';
import { MotionService } from '../../shared/motion.service';

/**
 * Côte vue depuis la plage, dans le premier écran : l'horizon et son récif,
 * l'îlot Amédée et son phare, le lagon traversé par une pirogue, le rivage,
 * le sable et un cocotier.
 *
 * Décor interactif : l'hôte n'est pas masqué aux lecteurs d'écran. Chaque
 * partie décorative porte son propre `aria-hidden`, seuls le bouton du phare
 * et son message restent exposés. Les animations sont mises en pause hors
 * écran grâce à InViewDirective.
 */
@Component({
  selector: 'app-coast',
  templateUrl: './coast.html',
  styleUrl: './coast.scss',
  hostDirectives: [InViewDirective],
  host: { class: 'decor coast' },
})
export class Coast {
  protected readonly motion = inject(MotionService);

  /** Vrai pendant l'allumage du phare (faisceaux, voile doré, message). */
  protected readonly lit = signal(false);

  private timer?: ReturnType<typeof setTimeout>;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  /**
   * Allume le phare : deux balayages, puis il s'éteint. Un second clic
   * pendant l'allumage est ignoré. Sans animation (mouvement réduit ou
   * « Calme plat »), les faisceaux restent fixes et l'allumage est plus court.
   */
  protected light(): void {
    if (this.lit()) {
      return;
    }
    this.lit.set(true);
    this.timer = setTimeout(() => this.lit.set(false), this.motion.calm() ? 3000 : 4500);
  }
}
