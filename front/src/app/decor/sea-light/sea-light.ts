import { Component } from '@angular/core';
import { InViewDirective } from '../../shared/in-view.directive';

/**
 * Lumière sous la surface, en haut de la zone du lagon : deux réseaux de
 * caustiques (pseudo-éléments de l'hôte) et cinq rayons inclinés.
 *
 * Décor pur, sans logique : masqué aux lecteurs d'écran, sans pointeur, mis
 * en pause hors écran grâce à InViewDirective, et figé par « Calme plat ».
 */
@Component({
  selector: 'app-sea-light',
  templateUrl: './sea-light.html',
  styleUrl: './sea-light.scss',
  hostDirectives: [InViewDirective],
  host: { class: 'decor sea-light', 'aria-hidden': 'true' },
})
export class SeaLight {}
