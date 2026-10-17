import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

/** Ce qu'envoie le formulaire de contact (siteWeb : champ piège, vide pour un humain). */
export interface NouveauMessage {
  readonly nom: string;
  readonly email: string;
  readonly contenu: string;
  readonly siteWeb: string;
}

/** Un message tel que le renvoie l'API à la page /admin. */
export interface MessageRecu {
  readonly id: number;
  readonly nom: string;
  readonly email: string;
  readonly contenu: string;
  /** Date ISO 8601. */
  readonly creeLe: string;
  readonly lu: boolean;
}

/**
 * Appels à l'API des messages. En production, nginx relaie `/api` vers le
 * conteneur Spring Boot (front/nginx.conf) ; en développement, c'est le
 * proxy du serveur Angular (front/proxy.conf.json). Lire, marquer et
 * supprimer demandent une session administrateur (voir AdminService).
 */
@Injectable({ providedIn: 'root' })
export class MessagesService {
  private readonly http = inject(HttpClient);
  private readonly url = '/api/messages';

  envoyer(message: NouveauMessage): Observable<void> {
    return this.http.post<void>(this.url, message);
  }

  lister(): Observable<MessageRecu[]> {
    return this.http.get<MessageRecu[]>(this.url);
  }

  marquerLu(id: number): Observable<void> {
    return this.http.patch<void>(`${this.url}/${id}/lu`, null);
  }

  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
