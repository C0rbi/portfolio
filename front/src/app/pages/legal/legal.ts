import { Component } from '@angular/core';
import { EMAIL, HEBERGEUR } from '../../data/site';

/**
 * Mentions légales : éditeur, hébergeur (dès qu'il est renseigné dans
 * `data/site.ts`), données personnelles et crédits. La page est posée dans
 * l'eau, comme la fin de chaque page, pour se raccorder au footer.
 */
@Component({
  selector: 'app-legal',
  templateUrl: './legal.html',
  styleUrl: './legal.scss',
})
export class LegalPage {
  protected readonly email = EMAIL;
  protected readonly hebergeur = HEBERGEUR;
}
