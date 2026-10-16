/** Adresse de contact : footer, bouteille à la mer et mentions légales. */
export const EMAIL = 'allan.nicolas331966@gmail.com';

export interface Hebergeur {
  readonly nom: string;
  readonly adresse: string;
  readonly telephone?: string;
  readonly site: string;
}

/**
 * Hébergeur du site, exigé par les mentions légales (null : la rubrique ne
 * s'affiche pas). Le site tourne sur un serveur loué chez OVH : adresse
 * reprise des mentions légales d'OVHcloud, téléphone de son support.
 */
export const HEBERGEUR: Hebergeur | null = {
  nom: 'OVH SAS',
  adresse: '2 rue Kellermann, 59100 Roubaix, France',
  telephone: '1007',
  site: 'https://www.ovhcloud.com',
};

/**
 * Tableau de synthèse officiel de l'épreuve E5 (modèle de la circulaire),
 * déposé dans `public/` : par exemple 'tableau-de-synthese.pdf'.
 * Tant qu'il vaut null, le bouton de téléchargement n'est pas affiché.
 */
export const TABLEAU_SYNTHESE: string | null = null;
