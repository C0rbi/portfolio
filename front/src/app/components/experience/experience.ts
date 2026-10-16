import { Component, computed, signal } from '@angular/core';
import { RevealDirective } from '../../shared/reveal.directive';

type Track = 'pro' | 'formation';
type Filter = Track | 'all';

interface TimelineEntry {
  readonly period: string;
  readonly title: string;
  readonly org: string;
  readonly track: Track;
  readonly current?: boolean;
  /** Étape encore à venir : affichée en pointillés sur la frise. */
  readonly upcoming?: boolean;
  readonly description?: string;
  readonly tags?: readonly string[];
}

@Component({
  selector: 'app-experience',
  imports: [RevealDirective],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
})
export class Experience {
  /** Parcours professionnel et scolaire réunis sur une seule frise. */
  private readonly entries: readonly TimelineEntry[] = [
    {
      period: 'Objectif 2027',
      title: 'Licence professionnelle MIAW',
      org: 'Université de la Nouvelle-Calédonie · Nouméa',
      track: 'formation',
      upcoming: true,
      description:
        'Métiers de l’Informatique : Applications Web. La suite logique du BTS pour approfondir le développement web.',
      tags: ['Développement web', 'Bac +3'],
    },
    {
      period: '2026 — aujourd’hui',
      title: 'Alternant développeur',
      org: 'CSB · Calédonienne de Solutions Business',
      track: 'pro',
      current: true,
      description:
        'Préparation et paramétrage de terminaux de paiement, puis développement d’outils Python pour les équipes monétiques, livrés avec Docker et GitLab CI/CD.',
      tags: ['Monétique', 'TPE', 'Python', 'Docker', 'MySQL', 'GitLab CI/CD'],
    },
    {
      period: 'Oct. — Nov. 2025',
      title: 'Stagiaire développeur web',
      org: 'Lagoon · Nouméa',
      track: 'pro',
      description:
        'Projet Tenjity : refonte de l’interface d’un site de traduction dynamique de pages web. Travail sur l’UI/UX et intégration JavaScript.',
      tags: ['JavaScript', 'UI/UX', 'Intégration'],
    },
    {
      period: 'Nov. — Déc. 2024',
      title: 'Stagiaire comptable',
      org: 'SCIE · Nouméa',
      track: 'pro',
      description:
        'Cycles fournisseurs et trésorerie : rapprochements bancaires, saisie d’écritures et traitement des frais généraux. Suivi des bons de commande et de la facturation.',
      tags: ['Gestion', 'Processus métier'],
    },
    {
      period: '2025 — 2026',
      title: 'BTS SIO · option SLAM',
      org: 'Formation en alternance · Nouméa',
      track: 'formation',
      current: true,
      description:
        'Solutions Logicielles et Applications Métiers : développement, bases de données, réseaux et cybersécurité.',
      tags: ['Java', 'Angular', 'SQL', 'Cybersécurité'],
    },
    {
      period: '2024',
      title: 'DCG · 1re année',
      org: 'Diplôme de Comptabilité et de Gestion',
      track: 'formation',
      description:
        'Une année de comptabilité, de droit et de gestion. Une base qui m’aide aujourd’hui à comprendre les besoins métier derrière une application.',
      tags: ['Comptabilité', 'Droit', 'Management', 'Économie', 'Systèmes d’information de gestion'],
    },
    {
      period: '2022 — 2023',
      title: 'Baccalauréat STMG · Gestion Finance',
      org: 'Lycée · Nouvelle-Calédonie',
      track: 'formation',
      tags: ['Gestion et finance', 'Droit et économie', 'Management', 'Sciences de gestion et numérique'],
    },
  ];

  protected readonly filters: readonly { id: Filter; label: string }[] = [
    { id: 'all', label: 'Tout' },
    { id: 'pro', label: 'Professionnel' },
    { id: 'formation', label: 'Formation' },
  ];

  protected readonly activeFilter = signal<Filter>('all');

  /** Frise filtrée selon l’onglet choisi. */
  protected readonly visibleEntries = computed(() => {
    const filter = this.activeFilter();
    return filter === 'all' ? this.entries : this.entries.filter((e) => e.track === filter);
  });

  protected setFilter(filter: Filter): void {
    this.activeFilter.set(filter);
  }

  protected countOf(filter: Filter): number {
    return filter === 'all'
      ? this.entries.length
      : this.entries.filter((entry) => entry.track === filter).length;
  }
}
