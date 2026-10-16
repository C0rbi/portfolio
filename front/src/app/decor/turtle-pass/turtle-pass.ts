import { Component } from '@angular/core';
import { InViewDirective } from '../../shared/in-view.directive';

/**
 * Intermède du lagon, entre « Compétences » et « Certifications » : le
 * passage d'une tortue verte.
 *
 * Vue de dessus, comme sur une planche de carnet : quatre nageoires qui
 * battent (l'arrière à demi-phase) et une colonne de bulles au bord droit.
 *
 * Décor pur, sans logique : masqué aux lecteurs d'écran, sans pointeur, mis
 * en pause hors écran grâce à InViewDirective.
 */
@Component({
  selector: 'app-turtle-pass',
  templateUrl: './turtle-pass.html',
  styleUrl: './turtle-pass.scss',
  hostDirectives: [InViewDirective],
  host: { class: 'decor interlude', 'aria-hidden': 'true' },
})
export class TurtlePass {}
