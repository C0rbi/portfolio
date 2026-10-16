import { Component } from '@angular/core';
import { InViewDirective } from '../../shared/in-view.directive';

/**
 * Rivage pleine largeur, du sable à l'eau : le ressac efface les dernières
 * traces de pas.
 *
 * Décor pur : masqué aux lecteurs d'écran, sans pointeur, mis en pause hors
 * écran grâce à InViewDirective. Contenu livré par le lot 2.
 */
@Component({
  selector: 'app-shoreline',
  templateUrl: './shoreline.html',
  styleUrl: './shoreline.scss',
  hostDirectives: [InViewDirective],
  host: { class: 'decor shoreline', 'aria-hidden': 'true' },
})
export class Shoreline {}
