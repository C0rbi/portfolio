/**
 * Source unique des projets : la section d'accueil et les pages de détail
 * lisent toutes les deux ce fichier.
 */
import type { CompetenceCode } from './competences';

export type CodeLanguage = 'java' | 'typescript' | 'sql' | 'dart';

export interface CodeSample {
  /** Nom du fichier affiché au-dessus de l'extrait. */
  readonly file: string;
  readonly language: CodeLanguage;
  /** Une phrase qui explique ce que fait l'extrait. */
  readonly caption: string;
  readonly code: string;
}

export interface Project {
  readonly slug: string;
  readonly index: string;
  readonly name: string;
  readonly tagline: string;
  readonly year: string;
  readonly role: string;
  /** Résumé court, utilisé sur la carte de la page d'accueil. */
  readonly summary: string;
  /** Paragraphes de présentation sur la page de détail. */
  readonly about: readonly string[];
  readonly highlights: readonly string[];
  readonly features: readonly string[];
  readonly learned: readonly string[];
  readonly stack: readonly string[];
  readonly image: string;
  /** Dimensions réelles de `image`, en pixels : elles réservent la place avant le chargement. */
  readonly imageWidth: number;
  readonly imageHeight: number;
  /** Vignette illustrée affichée à la place de la capture sur la carte d'accueil. */
  readonly thumb?: 'pong';
  readonly repo: string;
  /** Compétences du bloc 1 (épreuve E5) mobilisées par le projet. */
  readonly competences: readonly CompetenceCode[];
  /** Crédit à afficher sous la capture (fond de carte, etc.). */
  readonly imageCredit?: string;
  readonly featured?: boolean;
  readonly samples: readonly CodeSample[];
}

export const PROJECTS: readonly Project[] = [
  {
    slug: 'ldnc',
    index: '01',
    name: 'LDNC',
    tagline: 'Une boutique en ligne de matériel informatique, du catalogue à la commande',
    year: '2026',
    role: 'Projet obligatoire · BTS SIO',
    summary:
      'Réplication d’un site e-commerce de matériel informatique : catalogue produit, panier persistant et authentification des clients.',
    about: [
      'LDNC est un projet obligatoire du BTS SIO. J’y ai mis en pratique l’ensemble de ce que couvre l’option SLAM : modélisation des données, développement d’une API, puis construction d’une interface qui consomme cette API.',
      'Le site reprend le parcours classique d’une boutique en ligne : on parcourt un catalogue, on filtre par catégorie, on ouvre une fiche produit, on remplit un panier, puis on valide une commande depuis son compte client.',
      'Côté serveur, l’application est découpée en trois couches — contrôleurs REST, services métier, repositories — pour que chaque responsabilité reste isolée et testable séparément.',
    ],
    highlights: [
      'API REST sécurisée et modèle relationnel complet',
      'Parcours d’achat du catalogue jusqu’à la commande',
      'Front Angular découpé en composants réutilisables',
    ],
    features: [
      'Catalogue paginé avec filtres par catégorie et recherche',
      'Fiche produit détaillée avec gestion du stock',
      'Panier conservé entre deux visites',
      'Inscription, connexion et espace client',
      'Historique des commandes passées',
    ],
    learned: [
      'Structurer une API en couches plutôt que de tout mettre dans le contrôleur',
      'Concevoir un schéma relationnel avant d’écrire la moindre ligne de code',
      'Gérer les états de chargement et d’erreur côté interface',
    ],
    stack: ['Angular', 'Spring Boot', 'PostgreSQL', 'REST'],
    image: 'ldnc-preview.png',
    imageWidth: 1860,
    imageHeight: 810,
    repo: 'https://github.com/C0rbi/Nicolas_Allan_Projet_Web_LDNC',
    competences: ['B1.3', 'B1.4', 'B1.5'],
    featured: true,
    samples: [
      {
        file: 'PanierService.java',
        language: 'java',
        caption:
          'Ajout d’un article au panier : le service vérifie le stock, puis incrémente la ligne existante plutôt que d’en créer une seconde.',
        code: `@Service
public class PanierService {

    private final PanierRepository panierRepository;
    private final ProduitRepository produitRepository;

    public PanierService(PanierRepository panierRepository,
                         ProduitRepository produitRepository) {
        this.panierRepository = panierRepository;
        this.produitRepository = produitRepository;
    }

    @Transactional
    public Panier ajouterArticle(Long clientId, Long produitId, int quantite) {
        Produit produit = produitRepository.findById(produitId)
                .orElseThrow(() -> new ProduitIntrouvableException(produitId));

        if (produit.getStock() < quantite) {
            throw new StockInsuffisantException(produit, quantite);
        }

        Panier panier = panierRepository.findByClientId(clientId)
                .orElseGet(() -> panierRepository.save(new Panier(clientId)));

        panier.lignePour(produit)
              .ifPresentOrElse(
                  ligne -> ligne.ajouter(quantite),
                  () -> panier.ajouterLigne(new LignePanier(produit, quantite)));

        return panierRepository.save(panier);
    }
}`,
      },
      {
        file: 'panier.service.ts',
        language: 'typescript',
        caption:
          'Côté Angular, le panier est exposé sous forme de signals : le total se recalcule tout seul à chaque changement.',
        code: `@Injectable({ providedIn: 'root' })
export class PanierService {
  private readonly http = inject(HttpClient);
  private readonly lignes = signal<LignePanier[]>([]);

  readonly articles = this.lignes.asReadonly();

  readonly total = computed(() =>
    this.lignes().reduce((somme, l) => somme + l.produit.prix * l.quantite, 0),
  );

  readonly nombreArticles = computed(() =>
    this.lignes().reduce((somme, l) => somme + l.quantite, 0),
  );

  ajouter(produit: Produit, quantite = 1): void {
    this.http
      .post<LignePanier[]>('/api/panier/articles', { produitId: produit.id, quantite })
      .subscribe((lignes) => this.lignes.set(lignes));
  }
}`,
      },
    ],
  },
  {
    slug: 'caillou-tour',
    index: '02',
    name: 'Caillou Tour',
    tagline: 'Une application mobile pour découvrir les lieux de la Nouvelle-Calédonie, carte à l’appui',
    year: '2026',
    role: 'Projet en binôme · BTS SIO',
    summary:
      'Application Android de découverte touristique de la Nouvelle-Calédonie, développée à deux : carte OpenStreetMap, lieux à visiter et comptes membres.',
    about: [
      'Caillou Tour est notre projet de fin d’année de BTS, réalisé à deux avec Manley pour une agence de tourisme fictive basée à Nouméa. L’application doit permettre à un visiteur de découvrir les lieux emblématiques du territoire, de les situer sur une carte et de s’y rendre.',
      'L’architecture est en trois tiers : une application Flutter pour Android, une API REST en Spring Boot et une base PostgreSQL. La carte utilise les tuiles OpenStreetMap, et la position du visiteur reste sur son téléphone : elle n’est jamais envoyée au serveur.',
      'Dans le binôme, je me suis surtout occupé de l’application Flutter (navigation, connexion, inscription, profil) et des documents de conception : user stories, charte graphique et diagrammes UML. Manley a pris en charge l’essentiel de l’API, dont j’ai écrit la première version des entités.',
    ],
    highlights: [
      'Projet à deux, de la conception au code',
      'Application Flutter reliée à une API Spring Boot',
      'Carte OpenStreetMap de la Nouvelle-Calédonie',
    ],
    features: [
      'Carte OpenStreetMap limitée à la Nouvelle-Calédonie',
      'Lieux les plus visités et lieux enregistrés par catégorie',
      'Inscription et connexion reliées à l’API, avec des messages d’erreur clairs',
      'Page de profil du membre connecté',
      'Navigation par onglets en bas de l’écran',
      'Prévu d’ici la fin du BTS : fiches de lieux, favoris, avis et administration du catalogue',
    ],
    learned: [
      'Travailler à deux sur le même dépôt, avec des branches et des pull requests',
      'Appeler une API REST depuis une application mobile et gérer ses erreurs',
      'Partir des user stories et des diagrammes UML avant d’écrire le code',
    ],
    stack: ['Flutter', 'Dart', 'Spring Boot', 'PostgreSQL', 'OpenStreetMap'],
    image: 'caillou-tour-preview.webp',
    imageWidth: 1600,
    imageHeight: 1000,
    repo: 'https://github.com/kibagami-nc/Projet_mobile_POO_Manley_Allan',
    competences: ['B1.3', 'B1.4', 'B1.5'],
    imageCredit: 'fond de carte © les contributeurs d’OpenStreetMap',
    samples: [
      {
        file: 'register.dart',
        language: 'dart',
        caption:
          'L’inscription côté application : les champs sont vérifiés sur le téléphone avant d’appeler l’API, puis le nouveau membre est connecté directement. Les erreurs renvoyées par l’API sont affichées telles quelles.',
        code: `Future<void> _creerCompte() async {
  final nom = _nomController.text.trim();
  final email = _emailController.text.trim();
  final motDePasse = _passwordController.text;

  // Vérifications locales avant d'appeler l'API
  if (nom.isEmpty || email.isEmpty || motDePasse.isEmpty) {
    _afficher('Veuillez remplir tous les champs.');
    return;
  }
  if (!email.contains('@')) {
    _afficher('Adresse e-mail invalide.');
    return;
  }
  if (motDePasse != _confirmationController.text) {
    _afficher('Les mots de passe ne correspondent pas.');
    return;
  }

  setState(() => _enCours = true);
  try {
    final resultat = await _authService.inscription(
      nom: nom,
      email: email,
      motDePasse: motDePasse,
    );
    // Compte créé : le nouveau membre est connecté directement
    Session.instance.ouvrir(
      token: resultat.token,
      utilisateur: resultat.utilisateur,
    );

    if (!mounted) return;
    Navigator.pushAndRemoveUntil(
      context,
      RouteSansAnimation(builder: (context) => const Menu()),
      (route) => false,
    );
  } on ApiException catch (e) {
    if (!mounted) return;
    _afficher(e.message);
  } finally {
    if (mounted) setState(() => _enCours = false);
  }
}`,
      },
    ],
  },
  {
    slug: 'java-pong',
    index: '03',
    name: 'Java PONG',
    tagline: 'Le Pong recodé de zéro, sans aucune bibliothèque externe',
    year: '2025',
    role: 'Projet personnel',
    summary:
      'Une version du Pong codée uniquement avec les bibliothèques standards de Java, pour travailler la boucle de jeu et la détection de collisions.',
    about: [
      'J’ai écrit ce Pong pour comprendre ce qui se passe réellement dans un jeu, sans moteur pour me mâcher le travail : uniquement Swing et AWT, livrés avec Java.',
      'Tout l’intérêt était là : gérer moi-même la boucle de jeu, le rafraîchissement de l’affichage et les collisions, au lieu d’appeler une méthode toute faite.',
      'C’est un petit projet, mais c’est celui qui m’a fait comprendre la différence entre « le code fonctionne » et « le code tourne à une vitesse constante quelle que soit la machine ».',
    ],
    highlights: ['Boucle de rendu maison', 'Zéro dépendance externe'],
    features: [
      'Deux raquettes pilotées au clavier',
      'Rebonds dont l’angle dépend du point d’impact',
      'Accélération progressive de la balle',
      'Score affiché et partie relançable',
    ],
    learned: [
      'Découpler la mise à jour de la physique et l’affichage',
      'Raisonner en vecteurs pour les rebonds',
      'Organiser un projet Java en classes aux rôles clairs',
    ],
    stack: ['Java', 'Swing', 'POO'],
    image: 'javaPong-preview.png',
    imageWidth: 1596,
    imageHeight: 895,
    thumb: 'pong',
    repo: 'https://github.com/C0rbi/Java-PONG',
    competences: ['B1.6'],
    samples: [
      {
        file: 'Balle.java',
        language: 'java',
        caption:
          'Le rebond sur une raquette : plus la balle touche loin du centre, plus elle repart en diagonale.',
        code: `public void rebondirSur(Raquette raquette) {
    // Position du point d'impact, ramenee entre -1 (haut) et 1 (bas)
    double centreRaquette = raquette.getY() + raquette.getHauteur() / 2.0;
    double impact = (y - centreRaquette) / (raquette.getHauteur() / 2.0);
    impact = Math.max(-1.0, Math.min(1.0, impact));

    // L'angle de sortie depend de ce point d'impact
    double angle = impact * ANGLE_MAXIMAL;
    int direction = (vitesseX > 0) ? -1 : 1;

    vitesseX = direction * vitesse * Math.cos(angle);
    vitesseY = vitesse * Math.sin(angle);

    // Chaque echange accelere un peu la balle, jusqu'a un plafond
    vitesse = Math.min(vitesse * FACTEUR_ACCELERATION, VITESSE_MAXIMALE);
}`,
      },
      {
        file: 'BoucleDeJeu.java',
        language: 'java',
        caption:
          'La boucle principale : la physique avance à pas fixe pour que le jeu se comporte pareil sur toutes les machines.',
        code: `@Override
public void run() {
    final double pasFixe = 1_000_000_000.0 / 60.0; // 60 mises a jour par seconde
    long precedent = System.nanoTime();
    double retard = 0;

    while (enCours) {
        long maintenant = System.nanoTime();
        retard += (maintenant - precedent) / pasFixe;
        precedent = maintenant;

        // On rattrape le retard accumule avant de dessiner
        while (retard >= 1) {
            partie.mettreAJour();
            retard--;
        }

        panneau.repaint();
    }
}`,
      },
    ],
  },
  {
    slug: 'portfolio',
    index: '04',
    name: 'Portfolio',
    tagline: 'Ce site : une plongée dans le lagon de Nouméa, du ciel jusqu’au fond',
    year: 'En continu',
    role: 'Projet personnel',
    summary:
      'Ce site : une coupe du lagon de Nouméa, du ciel au fond, en Angular et SCSS sans framework CSS, avec des décors SVG animés en CSS.',
    about: [
      'Je voulais un portfolio qui ne ressemble pas à un gabarit, et qui parle de chez moi. La page d’accueil se lit comme une coupe du lagon de Nouméa : on part du ciel, on traverse la plage et le sable, on passe le rivage, puis on plonge dans le lagon jusqu’au fond.',
      'La lecture devient une plongée. Un profondimètre, dans le header, compte de +4 m à −22 m au fil du défilement, et chaque titre de section porte sa sonde, comme sur une carte marine.',
      'Les décors sont des SVG animés en CSS, uniquement sur transform et opacity. Ils restent dans les marges, jamais sous le texte, et se mettent en pause dès qu’ils sortent de l’écran. Certains répondent : le phare de l’îlot Amédée s’allume au clic, le banc farouche s’écarte du curseur et la bouteille à la mer ouvre un popover natif.',
      'Quatre directives Angular (reveal, in-view, counter, spotlight) et un service, MotionService, se contentent de poser une classe ou une variable au bon moment. La préférence prefers-reduced-motion est respectée par défaut ; « Calme plat » met les animations en pause et « Animer le lagon » les réactive pour qui le souhaite. Les deux choix sont mémorisés.',
    ],
    highlights: ['Coupe du lagon en SVG animé', 'Mouvement réglable par le visiteur'],
    features: [
      'Coupe du lagon : ciel, plage, sable, rivage, lagon, fond',
      'Profondimètre de +4 m à −22 m et sondes sur chaque section',
      'Décors SVG animés en CSS, mis en pause hors écran',
      'Phare, banc farouche et bouteille à la mer en popover natif',
      '« Calme plat » et « Animer le lagon », mémorisés d’une visite à l’autre',
      'Contrastes AA calculés sur tous les fonds',
    ],
    learned: [
      'Raconter un lieu avec des décors qui laissent la place au contenu',
      'Animer seulement transform et opacity, et mettre en pause ce qu’on ne voit pas',
      'Respecter prefers-reduced-motion sans priver ceux qui veulent les animations',
      'Calculer les contrastes plutôt que de les juger à l’œil',
    ],
    stack: ['Angular', 'SCSS', 'TypeScript', 'SVG'],
    image: 'portfolio-preview.png',
    imageWidth: 1600,
    imageHeight: 1000,
    repo: 'https://github.com/C0rbi/portfolio',
    competences: ['B1.3', 'B1.6'],
    samples: [
      {
        file: 'motion.service.ts',
        language: 'typescript',
        caption:
          'Le service qui règle le mouvement : quatre signals résument la préférence système et les choix du visiteur, puis un effet pose les classes motion-ok et is-still sur <html>. Les animations, elles, restent en CSS.',
        code: `@Injectable({ providedIn: 'root' })
export class MotionService {
  /** prefers-reduced-motion: reduce (suivi en direct, false sans matchMedia). */
  readonly reduced: Signal<boolean> = this.reducedState.asReadonly();
  readonly forced: Signal<boolean> = this.forcedState.asReadonly();

  /** Vrai si les animations sont permises (pas de préférence, ou choix explicite). */
  readonly animate: Signal<boolean> = computed(() => !this.reduced() || this.forced());

  /** Vrai si aucune animation décorative ne doit tourner. */
  readonly calm: Signal<boolean> = computed(() => !this.animate() || this.still());

  constructor() {
    this.watchReducedMotion();

    // Les classes sur <html> et la mémorisation suivent toujours l'état.
    effect(() => {
      const still = this.still();
      const forced = this.forced();
      const animate = this.animate();

      if (typeof document !== 'undefined') {
        const root = document.documentElement.classList;
        root.toggle('is-still', still);
        root.toggle('motion-ok', animate);
      }

      writeFlag(STILL_KEY, still);
      writeFlag(FORCED_KEY, forced);
    });
  }

  toggleChoice(): void {
    if (this.reduced()) {
      this.toggleForced();
    } else {
      this.toggleStill();
    }
  }
}`,
      },
    ],
  },
];

export function findProject(slug: string | null): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}
