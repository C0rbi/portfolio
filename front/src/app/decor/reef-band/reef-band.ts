import { Component } from '@angular/core';
import { InViewDirective } from '../../shared/in-view.directive';

/**
 * Intermède du lagon, entre « Certifications » et « Veille » : patate de
 * corail, nautile et napoléon.
 *
 * La patate (corail cerveau, Acropora, gorgone, anémone et poisson-clown) est
 * un seul petit SVG dont les parties vivantes sont des <g> ; le nautile et le
 * napoléon sont des éléments HTML à part.
 *
 * Décor pur, sans logique : masqué aux lecteurs d'écran, sans pointeur, mis
 * en pause hors écran grâce à InViewDirective.
 */
@Component({
  selector: 'app-reef-band',
  templateUrl: './reef-band.html',
  styleUrl: './reef-band.scss',
  hostDirectives: [InViewDirective],
  host: { class: 'decor interlude', 'aria-hidden': 'true' },
})
export class ReefBand {}
