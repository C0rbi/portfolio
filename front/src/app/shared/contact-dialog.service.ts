import { Injectable, signal } from '@angular/core';

/**
 * Fenêtre « Écrire un message » : « Me contacter » (barre et tiroir mobile)
 * et le bouton du footer l'ouvrent, quelle que soit la page lue.
 */
@Injectable({ providedIn: 'root' })
export class ContactDialogService {
  /** Vrai tant que la fenêtre est ouverte. */
  readonly ouvert = signal(false);

  ouvrir(): void {
    this.ouvert.set(true);
  }

  fermer(): void {
    this.ouvert.set(false);
  }
}
