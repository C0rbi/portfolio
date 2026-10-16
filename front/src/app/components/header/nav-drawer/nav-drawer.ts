import { Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { NavLink } from '../header';

/**
 * Panneau de navigation mobile, sorti du header pour alléger sa feuille.
 *
 * Le header garde la main sur l'état : il ouvre le panneau, verrouille le
 * défilement de la page et le referme à la touche Échap. Fermé, le panneau
 * est inerte : ni le focus ni les lecteurs d'écran n'y entrent.
 */
@Component({
  selector: 'app-nav-drawer',
  imports: [RouterLink],
  templateUrl: './nav-drawer.html',
  styleUrl: './nav-drawer.scss',
})
export class NavDrawer {
  readonly open = input(false);
  readonly links = input.required<readonly NavLink[]>();
  readonly email = input.required<string>();

  /** Un lien a été suivi : le header referme le panneau. */
  readonly closed = output<void>();

  /** « Me contacter » : le header referme le panneau et ouvre la fenêtre de message. */
  readonly ecrire = output<void>();

  /**
   * Dernière section au-dessus de l'eau : la surface est dessinée sous elle,
   * comme sur une carte marine (sondes positives, puis négatives).
   */
  protected readonly surface = computed(() => {
    const links = this.links();
    for (let i = links.length - 1; i >= 0; i--) {
      if (links[i].sonde.startsWith('+')) {
        return i;
      }
    }
    return -1;
  });
}
