import { Component } from '@angular/core';
import { InViewDirective } from '../../shared/in-view.directive';

/**
 * Horizon compact qui termine l'entête de la fiche projet : quelques nuages,
 * des îles au loin, le récif, une pirogue sur le lagon, l'écume, puis la plage
 * où la capture du projet est posée.
 *
 * Décor pur : masqué aux lecteurs d'écran, sans pointeur, mis en pause hors
 * écran grâce à InViewDirective. Affiché hors de l'accueil : aucune référence
 * `#id` dans ses SVG (elles casseraient avec `<base href="/">`).
 */
@Component({
  selector: 'app-mini-horizon',
  templateUrl: './mini-horizon.html',
  styleUrl: './mini-horizon.scss',
  hostDirectives: [InViewDirective],
  host: { class: 'decor mini-horizon', 'aria-hidden': 'true' },
})
export class MiniHorizon {}
