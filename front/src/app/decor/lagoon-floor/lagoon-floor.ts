import { Component, ElementRef, effect, inject, input, signal, untracked, viewChild } from '@angular/core';
import { InViewDirective } from '../../shared/in-view.directive';

/**
 * Fond sableux du lagon, à −22 m : une mère loche sous son rocher, des
 * herbiers, un bénitier, un tricot rayé qui passe une seule fois… et une
 * bouteille à la mer.
 *
 * Le décor est masqué aux lecteurs d'écran partie par partie : l'hôte ne
 * porte pas `aria-hidden`, car la bouteille est un vrai bouton qui ouvre
 * un message (popover natif : Échap, clic extérieur et couche supérieure
 * sans une ligne de JS).
 *
 * Présent sur toutes les pages (il vit dans le footer) : aucune référence
 * `#id` dans ses SVG, à cause de `<base href="/">`.
 */
@Component({
  selector: 'app-lagoon-floor',
  templateUrl: './lagoon-floor.html',
  styleUrl: './lagoon-floor.scss',
  hostDirectives: [InViewDirective],
  host: { class: 'decor floor' },
})
export class LagoonFloor {
  /** Adresse glissée dans la bouteille. */
  readonly email = input.required<string>();

  /** Résultat de la copie, annoncé par la zone `aria-live`. */
  protected readonly status = signal('');

  /**
   * Le tricot rayé ne traverse qu'une fois : il attend que le visiteur soit
   * descendu jusqu'ici. Sans cette garde, sa traversée démarrerait pendant le
   * premier rendu, quand le footer est un instant à l'écran avant la page.
   */
  protected readonly swim = signal(false);

  private readonly view = inject(InViewDirective, { self: true });
  private readonly copyButton = viewChild<ElementRef<HTMLButtonElement>>('copyButton');

  constructor() {
    effect(() => {
      const arrived = this.view.inView() && typeof window !== 'undefined' && window.scrollY > 0;
      if (arrived && !untracked(this.swim)) {
        this.swim.set(true);
      }
    });
  }

  /** Copie l'adresse dans le presse-papiers, et dit si cela a marché. */
  protected async copy(): Promise<void> {
    // On vide d'abord le message : une seconde copie réussie est ainsi
    // annoncée de nouveau par les lecteurs d'écran.
    this.status.set('');

    const clipboard = typeof navigator === 'undefined' ? undefined : navigator.clipboard;

    try {
      if (!clipboard?.writeText) {
        throw new Error('Presse-papiers indisponible');
      }
      await clipboard.writeText(this.email());
      this.status.set('Adresse copiée');
    } catch {
      this.status.set('Copie impossible, sélectionnez l’adresse');
    }
  }

  /**
   * Ouverture : le focus passe sur « Copier l'adresse », l'action principale.
   * Fermeture : le message de copie est effacé pour la prochaine fois (le
   * popover rend lui-même le focus à la bouteille).
   */
  protected onToggle(event: Event): void {
    const opened = (event as Event & { newState?: string }).newState === 'open';

    if (opened) {
      this.copyButton()?.nativeElement.focus();
    } else {
      this.status.set('');
    }
  }

  /**
   * Le focus quitte le message au clavier (Tab après « Refermer », Maj+Tab
   * vers la bouteille) : on le referme, plutôt que de laisser une feuille
   * ouverte par-dessus une page où l'on continue de naviguer.
   * Sans `relatedTarget` (clic sur le papier, fenêtre qui perd le focus),
   * il reste ouvert. Garde `hidePopover` : jsdom ne connaît pas les popovers.
   */
  protected onFocusOut(event: FocusEvent): void {
    const note = event.currentTarget as HTMLElement;
    const next = event.relatedTarget as Node | null;

    if (
      next &&
      !note.contains(next) &&
      typeof note.hidePopover === 'function' &&
      note.matches(':popover-open')
    ) {
      note.hidePopover();
    }
  }
}
