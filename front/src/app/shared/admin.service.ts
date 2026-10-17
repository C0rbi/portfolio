import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

/** Réponse de l'API : l'administrateur connecté. */
export interface AdminConnecte {
  readonly identifiant: string;
}

/**
 * Connexion à la page /admin. La session tient dans un cookie posé par
 * l'API (HttpOnly : le JavaScript ne le voit jamais) ; le navigateur le
 * renvoie de lui-même à chaque appel.
 */
@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly url = '/api/admin';

  connexion(identifiant: string, motDePasse: string): Observable<AdminConnecte> {
    return this.http.post<AdminConnecte>(`${this.url}/connexion`, { identifiant, motDePasse });
  }

  /** Qui est connecté : erreur 401 si personne. */
  session(): Observable<AdminConnecte> {
    return this.http.get<AdminConnecte>(`${this.url}/session`);
  }

  deconnexion(): Observable<void> {
    return this.http.post<void>(`${this.url}/deconnexion`, null);
  }
}
