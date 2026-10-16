import type { CompetenceCode } from './competences';

/**
 * Réalisations en entreprise, résumées en quelques lignes. Le détail reste
 * dans le rapport d'alternance : ici, rien de confidentiel sur la CSB.
 */
export interface Mission {
  readonly title: string;
  readonly org: string;
  readonly period: string;
  readonly summary: string;
  readonly stack: readonly string[];
  readonly competences: readonly CompetenceCode[];
}

export const MISSIONS: readonly Mission[] = [
  {
    title: 'Préparation des terminaux de paiement',
    org: 'CSB · alternance',
    period: '2026',
    summary:
      'Préparation, paramétrage et tests de terminaux de paiement, remise à zéro d’appareils, puis mise à jour de la procédure de préparation utilisée par l’équipe.',
    stack: ['Monétique', 'TPE', 'Documentation'],
    competences: ['B1.1', 'B1.2', 'B1.5'],
  },
  {
    title: 'Outil de comparaison de fichiers',
    org: 'CSB · alternance',
    period: '2026',
    summary:
      'Reprise d’un outil Python utilisé pour une migration de serveur : prise en charge de nouveaux formats de fichiers, tests unitaires, conteneur Docker et pipeline GitLab CI/CD.',
    stack: ['Python', 'Docker', 'GitLab CI/CD'],
    competences: ['B1.2', 'B1.5'],
  },
  {
    title: 'Suivi automatique d’un fichier de cartes bancaires',
    org: 'CSB · alternance',
    period: '2026',
    summary:
      'Application Python qui compare deux versions d’un fichier de plages de cartes (un million de lignes, ramenées à 6 000), garde l’historique dans MySQL et envoie un rapport par e-mail.',
    stack: ['Python', 'MySQL', 'Docker Compose', 'GitLab CI/CD'],
    competences: ['B1.4', 'B1.5'],
  },
  {
    title: 'Refonte de l’interface de Tenjity',
    org: 'Lagoon · stage',
    period: '2025',
    summary:
      'Refonte de l’interface d’un site de traduction dynamique de pages web : travail sur l’UI/UX et intégration JavaScript.',
    stack: ['JavaScript', 'UI/UX'],
    competences: ['B1.2', 'B1.3', 'B1.4'],
  },
];
