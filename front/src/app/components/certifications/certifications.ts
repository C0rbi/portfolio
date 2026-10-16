import { Component } from '@angular/core';
import { RevealDirective } from '../../shared/reveal.directive';

interface Certification {
  readonly title: string;
  readonly issuer: string;
  readonly progress: number;
  readonly note?: string;
}

/** Rayon et circonférence de l'anneau de progression, partagés avec le SCSS. */
const RING_RADIUS = 26;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

@Component({
  selector: 'app-certifications',
  imports: [RevealDirective],
  templateUrl: './certifications.html',
  styleUrl: './certifications.scss',
})
export class Certifications {
  protected readonly ringRadius = RING_RADIUS;
  protected readonly ringLength = RING_LENGTH;

  /** Relevé du tableau de bord OpenClassrooms (octobre 2026) et du badge Cisco. */
  protected readonly certifications: readonly Certification[] = [
    {
      title: 'Apprenez à programmer en Java',
      issuer: 'OpenClassrooms',
      progress: 100,
      note: 'Bases du langage et programmation orientée objet.',
    },
    {
      title: 'Créez une application Java avec Spring Boot',
      issuer: 'OpenClassrooms',
      progress: 100,
      note: 'Architecture en couches, injection de dépendances et REST.',
    },
    {
      title: 'Débutez avec Angular',
      issuer: 'OpenClassrooms',
      progress: 100,
      note: 'Composants, routage et communication avec une API.',
    },
    {
      title: 'Apprenez à programmer avec JavaScript',
      issuer: 'OpenClassrooms',
      progress: 100,
      note: 'Variables, conditions, boucles, fonctions et objets.',
    },
    {
      title: 'Optimisez votre déploiement en créant des conteneurs avec Docker',
      issuer: 'OpenClassrooms',
      progress: 100,
      note: 'Images, conteneurs et services assemblés avec Docker Compose.',
    },
    {
      title: 'Apprenez les bases du langage Python',
      issuer: 'OpenClassrooms',
      progress: 100,
      note: 'Syntaxe, structures de données et premiers algorithmes.',
    },
    {
      title: 'Linux Unhatched',
      issuer: 'Cisco Networking Academy',
      progress: 100,
      note: 'Fondamentaux du système Linux et des commandes en ligne.',
    },
    {
      title: 'Créez votre site web avec HTML5 et CSS3',
      issuer: 'OpenClassrooms',
      progress: 92,
      note: 'Structure d’une page en HTML, mise en forme et mise en page en CSS.',
    },
    {
      title: 'Codez un site web accessible avec HTML & CSS',
      issuer: 'OpenClassrooms',
      progress: 8,
      note: 'Rendre un site utilisable par tous : sémantique, contrastes, clavier.',
    },
  ];

  /** Décalage du tracé pour dessiner l'arc correspondant au pourcentage. */
  protected offsetFor(progress: number): number {
    return RING_LENGTH * (1 - progress / 100);
  }

  /** Angle de l'index du manomètre, en face de la fin de l'arc. */
  protected angleFor(progress: number): string {
    return `${progress * 3.6}deg`;
  }
}
