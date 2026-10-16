import { Component } from '@angular/core';
import { InViewDirective } from '../../shared/in-view.directive';
import { RevealDirective } from '../../shared/reveal.directive';

interface WatchTopic {
  readonly kind: string;
  readonly title: string;
  readonly tagline: string;
  readonly body: string;
  readonly sources: readonly string[];
  readonly main?: boolean;
}

interface WatchStep {
  readonly step: string;
  readonly title: string;
  readonly text: string;
}

@Component({
  selector: 'app-tech-watch',
  imports: [RevealDirective, InViewDirective],
  templateUrl: './tech-watch.html',
  styleUrl: './tech-watch.scss',
})
export class TechWatch {
  protected readonly topics: readonly WatchTopic[] = [
    {
      kind: 'Sujet principal',
      title: 'Paiement mobile & sans contact',
      tagline: 'Comment le téléphone remplace la carte, et parfois même le terminal de paiement.',
      body:
        'Je suis l’évolution du paiement par téléphone : les portefeuilles comme Apple Pay et Google Pay, la tokenisation qui remplace le numéro de carte par un jeton, les smartphones qui servent de terminal de paiement (« Tap to Pay ») et Wero, le portefeuille lancé par des banques européennes. Un sujet proche de mon alternance à la CSB, où je travaille sur la monétique et les terminaux de paiement.',
      sources: ['Banque de France', 'IEOM', 'EMVCo', 'Feedly', 'Google Alerts'],
      main: true,
    },
    {
      kind: 'Veille secondaire',
      title: 'Cybersécurité & vulnérabilités web',
      tagline: 'Évolution des menaces et protection des données.',
      body:
        'Suivi des vulnérabilités du top OWASP (CSRF, XSS, injections SQL) et des méthodes de sécurisation applicables à mes architectures Spring Boot et Angular.',
      sources: ['Feedly', 'Google Alerts', 'OWASP'],
    },
  ];

  protected readonly method: readonly WatchStep[] = [
    {
      step: '01',
      title: 'Collecter',
      text: 'Flux RSS regroupés dans Feedly et alertes Google sur mes mots-clés.',
    },
    {
      step: '02',
      title: 'Trier',
      text: 'Lecture rapide, mise de côté des sources fiables et des articles de fond.',
    },
    {
      step: '03',
      title: 'Approfondir',
      text: 'Notes de synthèse et, quand c’est possible, mise en pratique sur un projet.',
    },
  ];
}
