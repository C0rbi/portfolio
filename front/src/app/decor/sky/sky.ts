import { Component } from '@angular/core';
import { InViewDirective } from '../../shared/in-view.directive';

/**
 * Ciel du hero : quelques nuages qui dérivent et deux sternes.
 *
 * Décor pur : masqué aux lecteurs d'écran, sans pointeur, mis en pause hors
 * écran grâce à InViewDirective. Posé sous le texte du hero, au-dessus de
 * son fond : les nuages blancs ne font qu'éclaircir le fond derrière le texte.
 */
@Component({
  selector: 'app-sky',
  templateUrl: './sky.html',
  styleUrl: './sky.scss',
  hostDirectives: [InViewDirective],
  host: { class: 'decor sky', 'aria-hidden': 'true' },
})
export class Sky {}
