import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { MessageRecu, MessagesService } from '../../shared/messages.service';

/** Clé du jeton dans la session : il disparaît à la fermeture de l'onglet. */
const CLE_JETON = 'admin-jeton';

/**
 * Boîte de réception des messages du formulaire de contact. La page n'est
 * liée nulle part et n'est pas indexée ; l'API refuse tout sans le jeton
 * défini dans le fichier .env du serveur (ADMIN_TOKEN).
 */
@Component({
  selector: 'app-admin',
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class AdminPage {
  private readonly api = inject(MessagesService);
  private readonly meta = inject(Meta);

  protected readonly jeton = signal(lireJeton());
  protected readonly saisie = signal('');
  protected readonly messages = signal<readonly MessageRecu[] | null>(null);
  protected readonly erreur = signal('');
  protected readonly chargement = signal(false);

  protected readonly nonLus = computed(() => this.messages()?.filter((m) => !m.lu).length ?? 0);

  constructor() {
    this.meta.updateTag({ name: 'robots', content: 'noindex' });
    inject(DestroyRef).onDestroy(() => this.meta.removeTag("name='robots'"));

    if (this.jeton()) {
      this.charger();
    }
  }

  protected connecter(event: Event): void {
    event.preventDefault();
    const jeton = this.saisie().trim();
    if (!jeton) {
      return;
    }
    this.jeton.set(jeton);
    ecrireJeton(jeton);
    this.charger();
  }

  protected deconnecter(): void {
    this.jeton.set('');
    ecrireJeton(null);
    this.messages.set(null);
  }

  protected charger(): void {
    this.chargement.set(true);
    this.erreur.set('');

    this.api.lister(this.jeton()).subscribe({
      next: (messages) => {
        this.messages.set(messages);
        this.chargement.set(false);
      },
      error: (reponse: HttpErrorResponse) => {
        this.chargement.set(false);
        if (reponse.status === 401) {
          this.deconnecter();
          this.erreur.set('Jeton refusé.');
        } else {
          this.erreur.set('L’API ne répond pas.');
        }
      },
    });
  }

  protected marquerLu(message: MessageRecu): void {
    this.api.marquerLu(this.jeton(), message.id).subscribe(() =>
      this.messages.update((liste) => liste?.map((m) => (m.id === message.id ? { ...m, lu: true } : m)) ?? null),
    );
  }

  protected supprimer(message: MessageRecu): void {
    if (!confirm(`Supprimer le message de ${message.nom} ?`)) {
      return;
    }
    this.api.supprimer(this.jeton(), message.id).subscribe(() =>
      this.messages.update((liste) => liste?.filter((m) => m.id !== message.id) ?? null),
    );
  }

  protected date(iso: string): string {
    return new Date(iso).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
  }
}

function lireJeton(): string {
  try {
    return sessionStorage.getItem(CLE_JETON) ?? '';
  } catch {
    return '';
  }
}

function ecrireJeton(jeton: string | null): void {
  try {
    if (jeton) {
      sessionStorage.setItem(CLE_JETON, jeton);
    } else {
      sessionStorage.removeItem(CLE_JETON);
    }
  } catch {
    // Stockage indisponible : le jeton ne vaut que pour cette page
  }
}
