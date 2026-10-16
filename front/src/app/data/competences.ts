/**
 * Compétences du bloc 1 du BTS SIO (« Support et mise à disposition de
 * services informatiques »), évaluées à l'épreuve E5. Chaque réalisation du
 * portfolio, projet ou mission, indique celles qu'elle mobilise.
 */

export type CompetenceCode = 'B1.1' | 'B1.2' | 'B1.3' | 'B1.4' | 'B1.5' | 'B1.6';

export interface Competence {
  readonly code: CompetenceCode;
  /** Libellé du référentiel. */
  readonly label: string;
}

export const BLOC1: readonly Competence[] = [
  { code: 'B1.1', label: 'Gérer le patrimoine informatique' },
  { code: 'B1.2', label: 'Répondre aux incidents et aux demandes d’assistance et d’évolution' },
  { code: 'B1.3', label: 'Développer la présence en ligne de l’organisation' },
  { code: 'B1.4', label: 'Travailler en mode projet' },
  { code: 'B1.5', label: 'Mettre à disposition des utilisateurs un service informatique' },
  { code: 'B1.6', label: 'Organiser son développement professionnel' },
];

/** Libellé d'une compétence à partir de son code. */
export function competenceLabel(code: CompetenceCode): string {
  return BLOC1.find((competence) => competence.code === code)?.label ?? code;
}
