import { Component, ElementRef, effect, inject, viewChild } from '@angular/core';
import { ContactDialogService } from '../../shared/contact-dialog.service';
import { ContactForm } from '../contact-form/contact-form';

/**
 * Fenêtre du formulaire de contact, un <dialog> natif ouvert en modal :
 * - showModal() rend le reste de la page inerte, garde le focus dans la
 *   fenêtre et le rend, à la fermeture, au bouton qui l'a ouverte ;
 * - Échap, la croix ou un clic sur le voile la referment ;
 * - le formulaire reste en mémoire : un message commencé n'est pas perdu.
 */
@Component({
  selector: 'app-contact-dialog',
  imports: [ContactForm],
  templateUrl: './contact-dialog.html',
  styleUrl: './contact-dialog.scss',
})
export class ContactDialog {
  protected readonly contact = inject(ContactDialogService);

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly form = viewChild.required(ContactForm);

  /** L'appui a commencé sur le voile, et non dans la fenêtre. */
  private appuiSurVoile = false;

  constructor() {
    effect(() => {
      const dialog = this.dialog().nativeElement;
      const ouvert = this.contact.ouvert();
      if (ouvert && !dialog.open) {
        dialog.showModal();
      } else if (!ouvert && dialog.open) {
        dialog.close();
      }
    });
  }

  /** Évènement « close » : Échap, la croix ou le voile. L'état suit. */
  protected fermee(): void {
    this.contact.fermer();
    this.form().oublierConfirmation();
  }

  protected appui(event: PointerEvent): void {
    this.appuiSurVoile = event.target === event.currentTarget;
  }

  /**
   * La fenêtre n'a pas de marge intérieure : un clic dont la cible est le
   * <dialog> lui-même vient du voile. L'appui doit aussi y avoir commencé,
   * pour qu'une sélection de texte qui déborde ne ferme rien.
   */
  protected clic(event: MouseEvent): void {
    if (this.appuiSurVoile && event.target === event.currentTarget) {
      this.contact.fermer();
    }
  }
}
