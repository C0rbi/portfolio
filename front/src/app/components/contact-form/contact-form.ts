import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EMAIL } from '../../data/site';
import { MessagesService } from '../../shared/messages.service';

type Etat = 'repos' | 'envoi' | 'envoye' | 'erreur';
type Champ = 'nom' | 'email' | 'contenu';

const OBLIGATOIRE: Record<Champ, string> = {
  nom: 'Indiquez votre nom.',
  email: 'Indiquez votre adresse e-mail.',
  contenu: 'Écrivez votre message.',
};

/**
 * Formulaire de contact, affiché dans la fenêtre « Écrire un message » : le
 * message part vers l'API, qui l'enregistre dans MySQL. Les contrôles
 * reprennent ceux du serveur, et les erreurs renvoyées par l'API
 * s'affichent sous le champ concerné.
 */
@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss',
})
export class ContactForm {
  private readonly messages = inject(MessagesService);

  protected readonly email = EMAIL;

  protected readonly form = new FormGroup({
    nom: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(100)] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(254)],
    }),
    contenu: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10), Validators.maxLength(5000)],
    }),
    // Champ piège : caché aux humains, un robot le remplit
    siteWeb: new FormControl('', { nonNullable: true }),
  });

  protected readonly etat = signal<Etat>('repos');
  protected readonly erreur = signal('');
  private readonly erreursServeur = signal<Partial<Record<Champ, string>>>({});

  protected envoyer(): void {
    if (this.etat() === 'envoi') {
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.etat.set('envoi');
    this.erreursServeur.set({});

    this.messages.envoyer(this.form.getRawValue()).subscribe({
      next: () => {
        this.etat.set('envoye');
        this.form.reset();
      },
      error: (reponse: HttpErrorResponse) => {
        this.etat.set('erreur');
        this.erreur.set(this.messageErreur(reponse));
        if (reponse.status === 400 && reponse.error?.erreurs) {
          this.erreursServeur.set(reponse.error.erreurs);
        }
      },
    });
  }

  /**
   * Fenêtre refermée : le « Merci » d'un envoi réussi ne doit pas attendre
   * la prochaine ouverture. Un message en cours de saisie, lui, est gardé.
   */
  oublierConfirmation(): void {
    if (this.etat() === 'envoye') {
      this.etat.set('repos');
    }
  }

  /** Message à afficher sous un champ : contrôle local d'abord, puis réponse de l'API. */
  protected erreurDe(champ: Champ): string | null {
    const controle = this.form.controls[champ];
    if (controle.touched && controle.errors) {
      if (controle.errors['required']) {
        return OBLIGATOIRE[champ];
      }
      if (controle.errors['email']) {
        return 'Cette adresse e-mail n’est pas valide.';
      }
      if (controle.errors['minlength']) {
        return 'Le message doit faire au moins 10 caractères.';
      }
      if (controle.errors['maxlength']) {
        return 'Ce champ est trop long.';
      }
    }
    return this.erreursServeur()[champ] ?? null;
  }

  private messageErreur(reponse: HttpErrorResponse): string {
    if (reponse.status === 429) {
      return 'Trop de messages envoyés depuis votre connexion. Réessayez dans quelques minutes.';
    }
    if (reponse.status === 400) {
      return 'Certains champs sont à corriger.';
    }
    return `Le service de messages ne répond pas pour le moment. Vous pouvez m’écrire à ${EMAIL}.`;
  }
}
