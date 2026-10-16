import { Component } from '@angular/core';
import { BLOC1, competenceLabel, type CompetenceCode } from '../../data/competences';
import { MISSIONS } from '../../data/missions';
import { PROJECTS } from '../../data/projects';
import { TABLEAU_SYNTHESE } from '../../data/site';
import { RevealDirective } from '../../shared/reveal.directive';

/** Une ligne du tableau : une réalisation et les compétences qu'elle mobilise. */
interface SynthesisRow {
  readonly name: string;
  readonly context: string;
  readonly codes: readonly CompetenceCode[];
}

/**
 * Suite de la section « Réalisations » : les missions en entreprise, en
 * bref, puis la synthèse des compétences du bloc 1 (épreuve E5) pour toutes
 * les réalisations du portfolio, projets compris.
 */
@Component({
  selector: 'app-missions',
  imports: [RevealDirective],
  templateUrl: './missions.html',
  styleUrl: './missions.scss',
})
export class Missions {
  protected readonly missions = MISSIONS;
  protected readonly bloc1 = BLOC1;
  protected readonly tableau = TABLEAU_SYNTHESE;
  protected readonly label = competenceLabel;

  /** Toutes les réalisations : les projets, puis les missions. */
  protected readonly rows: readonly SynthesisRow[] = [
    ...PROJECTS.map((p) => ({ name: p.name, context: `${p.role} · ${p.year}`, codes: p.competences })),
    ...MISSIONS.map((m) => ({ name: m.title, context: `${m.org} · ${m.period}`, codes: m.competences })),
  ];
}
