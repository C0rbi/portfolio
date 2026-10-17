import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Meta } from '@angular/platform-browser';
import { AdminService } from '../../shared/admin.service';
import { MessageRecu, MessagesService } from '../../shared/messages.service';

/**
 * Boîte de réception des messages du formulaire de contact, réservée au
 * compte administrateur (identifiant et mot de passe définis dans le fichier
 * .env du serveur). La page n'est liée nulle part et n'est pas indexée.
 */
@Component({
  selector: 'app-admin',
  imports: [ReactiveFormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class AdminPage {
  private readonly admin = inject(AdminService);
  private readonly api = inject(MessagesService);
  private readonly meta = inject(Meta);

  /** Identifiant de l'administrateur connecté, null tant que personne ne l'est. */
  protected readonly connecte = signal<string | null>(null);
  /** Vrai pendant que l'on vérifie, au chargement, si une session est déjà ouverte. */
  protected readonly verification = signal(true);
  protected readonly envoi = signal(false);
  protected readonly messages = signal<readonly MessageRecu[] | null>(null);
  protected readonly erreur = signal('');
  protected readonly chargement = signal(false);

  protected readonly nonLus = computed(() => this.messages()?.filter((m) => !m.lu).length ?? 0);

  protected readonly form = new FormGroup({
    identifiant: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    motDePasse: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  constructor() {
    this.meta.updateTag({ name: 'robots', content: 'noindex' });
    inject(DestroyRef).onDestroy(() => this.meta.removeTag("name='robots'"));

    // Page rechargée alors que la session est encore ouverte : on reprend
    this.admin.session().subscribe({
      next: ({ identifiant }) => {
        this.verification.set(false);
        this.ouvrir(identifiant);
      },
      error: () => this.verification.set(false),
    });
  }

  protected connecter(): void {
    if (this.envoi()) {
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.erreur.set('Indiquez votre identifiant et votre mot de passe.');
      return;
    }

    this.envoi.set(true);
    this.erreur.set('');
    const { identifiant, motDePasse } = this.form.getRawValue();

    this.admin.connexion(identifiant, motDePasse).subscribe({
      next: (reponse) => {
        this.envoi.set(false);
        this.form.reset();
        this.ouvrir(reponse.identifiant);
      },
      error: (reponse: HttpErrorResponse) => {
        this.envoi.set(false);
        this.form.controls.motDePasse.reset();
        this.erreur.set(messageConnexion(reponse.status));
      },
    });
  }

  protected deconnecter(): void {
    const fermer = () => this.fermer('');
    this.admin.deconnexion().subscribe({ next: fermer, error: fermer });
  }

  protected charger(): void {
    this.chargement.set(true);
    this.erreur.set('');

    this.api.lister().subscribe({
      next: (messages) => {
        this.messages.set(messages);
        this.chargement.set(false);
      },
      error: (reponse: HttpErrorResponse) => {
        this.chargement.set(false);
        this.echec(reponse);
      },
    });
  }

  protected marquerLu(message: MessageRecu): void {
    this.api.marquerLu(message.id).subscribe({
      next: () =>
        this.messages.update((liste) => liste?.map((m) => (m.id === message.id ? { ...m, lu: true } : m)) ?? null),
      error: (reponse: HttpErrorResponse) => this.echec(reponse),
    });
  }

  protected supprimer(message: MessageRecu): void {
    if (!confirm(`Supprimer le message de ${message.nom} ?`)) {
      return;
    }
    this.api.supprimer(message.id).subscribe({
      next: () => this.messages.update((liste) => liste?.filter((m) => m.id !== message.id) ?? null),
      error: (reponse: HttpErrorResponse) => this.echec(reponse),
    });
  }

  protected date(iso: string): string {
    return new Date(iso).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
  }

  private ouvrir(identifiant: string): void {
    this.connecte.set(identifiant);
    this.charger();
  }

  /** Retour au formulaire de connexion, avec un message éventuel. */
  private fermer(message: string): void {
    this.connecte.set(null);
    this.messages.set(null);
    this.erreur.set(message);
  }

  /** 401 : la session a expiré (2 h sans activité), il faut se reconnecter. */
  private echec(reponse: HttpErrorResponse): void {
    if (reponse.status === 401) {
      this.fermer('Session expirée : reconnectez-vous.');
    } else {
      this.erreur.set('L’API ne répond pas.');
    }
  }
}

function messageConnexion(statut: number): string {
  switch (statut) {
    case 401:
      return 'Identifiant ou mot de passe incorrect.';
    case 429:
      return 'Trop de tentatives. Réessayez dans quelques minutes.';
    case 400:
      return 'Indiquez votre identifiant et votre mot de passe.';
    default:
      return 'L’API ne répond pas.';
  }
}
