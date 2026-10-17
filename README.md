# Portfolio — Allan Nicolas

Étudiant en BTS SIO option SLAM, alternant développeur à la CSB (Nouméa).
Ce dépôt contient le code source de mon portfolio.

## Stack du site

* **Framework :** Angular 21 (composants autonomes, signals, rendu sans zone.js)
* **Styles :** SCSS uniquement, sans framework CSS
* **Polices :** Fraunces (titres), Space Grotesk (texte), JetBrains Mono (code)
* **API :** Spring Boot 4 (Java 21) pour le formulaire de contact
* **Base de données :** MySQL 8.4
* **Déploiement :** Docker Compose (nginx, API, MySQL)

## Mes compétences

* **Langages :** Java, PHP, TypeScript, SQL
* **Frameworks :** Spring Boot, Angular
* **Outils :** Git, MySQL, PostgreSQL, Docker

## Démarrer le projet

```bash
cd front
npm install
npm start
```

Le site est ensuite disponible sur `http://localhost:4200`.

| Commande | Rôle |
| --- | --- |
| `npm start` | Serveur de développement avec rechargement à chaud |
| `npm run build` | Build de production dans `front/dist/` |
| `npm test` | Tests unitaires (Vitest) |

En développement, `npm start` relaie `/api` vers `http://localhost:8088`
(`front/proxy.conf.json`), c'est-à-dire le site complet lancé avec Docker
(ci-dessous, avec `WEB_PORT=8088` dans `.env`) : le formulaire de contact et
`/admin` fonctionnent alors aussi sur le serveur de développement.

### Site complet (site + API + base)

```bash
cp .env.example .env   # puis remplir les secrets ; WEB_PORT=8088 en local
docker compose up -d --build
```

Le site complet répond sur `http://localhost:8088`. `docker compose down`
l'arrête, sans effacer les messages.

La mise en ligne est détaillée dans [DEPLOIEMENT.md](DEPLOIEMENT.md).

## Organisation du code

Le site compte quatre routes : la page d'accueil, une fiche détaillée par
projet, les mentions légales et `/admin`, la boîte de réception des messages
(réservée au compte administrateur, absente des menus et exclue des moteurs de
recherche).

```
front/src/app/
├── app.ts / app.routes.ts       # coquille : en-tête, router-outlet, pied de page
├── data/projects.ts             # source unique des projets (texte + extraits de code)
├── pages/
│   ├── home/                    # assemble la coupe : ciel, sable, rivage, lagon
│   ├── project/                 # fiche d'un projet (/projets/:slug)
│   ├── legal/                   # mentions légales
│   └── admin/                   # lecture des messages reçus (/admin)
├── components/                  # une section = un composant
│   ├── header/nav-drawer/       # tiroir de navigation sur mobile
│   ├── contact-dialog/          # fenêtre « Écrire un message » (<dialog> natif)
│   └── contact-form/            # formulaire de contact, affiché dans cette fenêtre
├── decor/                       # décors SVG animés, sans texte (aria-hidden)
│   ├── sky/                     # nuages et sternes
│   ├── coast/                   # côte, îlot Amédée et son phare, pirogue, cocotier
│   ├── sand-steps/              # traces de pas et crabe fantôme dans le sable
│   ├── shoreline/               # rivage : l'écume efface les derniers pas
│   ├── sea-light/               # caustiques et rayons sous la surface
│   ├── fish-school/             # banc de demoiselles qui s'écarte du curseur
│   ├── turtle-pass/             # passage d'une tortue verte
│   ├── reef-band/               # patate de corail, anémone et poisson-clown
│   ├── lagoon-floor/            # fond du lagon, mère loche et bouteille à la mer
│   └── mini-horizon/            # horizon compact en tête de fiche projet
└── shared/
    ├── contact-dialog.service.ts # ouvre la fenêtre de message (« Me contacter », footer)
    ├── admin.service.ts         # connexion, session et déconnexion de /admin
    ├── messages.service.ts      # appels à l'API des messages (formulaire, /admin)
    ├── motion.service.ts        # état du mouvement : préférence système, Calme plat, Animer le lagon
    ├── reveal.directive.ts      # apparition au défilement
    ├── in-view.directive.ts     # met les décors en pause hors écran
    ├── spotlight.directive.ts   # halo qui suit le curseur
    ├── counter.directive.ts     # compteurs animés
    └── code-block/              # affichage de code avec coloration maison
```

Toutes les pages sont chargées à la demande (`loadComponent`) : le premier
affichage ne télécharge que ce dont il a besoin.

L'API et la base tiennent en quelques fichiers :

```
api/src/main/java/nc/allan/portfolio/
├── message/                     # entité Message, dépôt JPA, contrôleur REST, limite d'envois
├── admin/                       # compte administrateur : connexion, session, mot de passe BCrypt
├── FenetreGlissante.java        # limite d'actions par adresse IP (messages, connexions)
└── ErreursApi.java              # erreurs de validation renvoyées champ par champ
api/src/main/resources/schema.sql # tables « message » et « administrateur », créées au démarrage
docker-compose.yml               # web (nginx + Angular), api, db
front/nginx.conf, securite.conf  # relais /api, limites par IP, en-têtes de sécurité (CSP…)
```

## Organisation des styles

Les styles sont écrits en SCSS et découpés par responsabilité. Les partials
globaux vivent dans `front/src/styles/` et sont accessibles depuis n'importe
quel composant grâce à `stylePreprocessorOptions.includePaths` déclaré dans
`angular.json`.

```
front/src/
├── styles.scss              # point d'entrée global
├── styles/
│   ├── _tokens.scss         # variables Sass (ruptures, rayons, courbes)
│   ├── _mixins.scss         # mixins (media queries, conteneur, focus, motion-safe…)
│   ├── _core.scss           # forward tokens + mixins → @use 'core' as *
│   ├── _root.scss           # custom properties CSS (palette, typo)
│   ├── _reset.scss          # remise à zéro et réglages de base
│   ├── _base.scss           # classes partagées (.shell, .btn, .chip…)
│   ├── _zones.scss          # zones de la coupe (sable, lagon), intermèdes, sondes
│   └── _animations.scss     # keyframes et classes d'apparition
└── app/
    ├── components/<nom>/<nom>.scss   # styles encapsulés par composant
    ├── decor/<nom>/<nom>.scss        # animations des décors
    └── shared/                       # directives et service du mouvement
```

Un composant importe la base commune avec une seule ligne :

```scss
@use 'core' as *;
```

## Choix techniques

* **Thème « Lagon calédonien »**, clair partout : la page d'accueil se lit
  comme une coupe du lagon de Nouméa, du ciel au fond (ciel → plage → sable →
  rivage → lagon → fond). Encre marine `#0e2a38` pour le texte, corail brique
  `#a03216` en accent principal et lagon `#0a5f69` en accent secondaire. Les
  contrastes AA ont été calculés par script sur tous les fonds du site.
* **Une plongée qui se lit** : un profondimètre, dans la marque du header,
  compte de +4 m à −22 m au fil du défilement, et chaque titre de section
  porte sa sonde, comme sur une carte marine.
* **Décors SVG animés en CSS** : nuages, phare, banc de poissons, tortue,
  corail… Ils n'animent que `transform` et `opacity`, restent dans les marges
  (jamais de texte dessous) et sont mis en pause hors écran par
  `InViewDirective`, déclarée en `hostDirectives` sur chaque décor.
* **Animations pilotées par le CSS** : les directives Angular (`appReveal`,
  `appInView`, `appSpotlight`, `appCounter`) se contentent de poser une classe
  ou une variable CSS au bon moment. Les courbes sont volontairement douces et
  de faible amplitude.
* **Mouvement** : `prefers-reduced-motion` est respecté par défaut. Le bouton
  « Calme plat » du header met en pause les animations décoratives ;
  « Animer le lagon » (choix volontaire, proposé quand le système demande moins
  d'animations, mémorisé dans `localStorage`) les réactive. Les contenus
  restent lisibles dans tous les cas.
* **Coloration du code sans dépendance** : un petit analyseur découpe le code
  en jetons, rendus ensuite par le gabarit. Aucun `innerHTML`, donc aucune
  surface d'injection.
* **Contenu typé en TypeScript** : expériences, projets, compétences et
  certifications sont des tableaux typés rendus avec `@for`, plutôt que du HTML
  recopié à la main.
* **Formulaire de contact** : « Me contacter » ouvre une fenêtre modale
  (`<dialog>` natif : focus gardé dans la fenêtre, Échap pour fermer, page
  inerte derrière). Les champs sont validés deux fois, par Angular
  pour guider le visiteur, puis par Spring (Bean Validation) car seule l'API
  fait foi. Un champ piège invisible écarte les robots, et une même adresse IP
  ne peut envoyer que 5 messages par tranche de 10 minutes.
* **Compte administrateur** : les messages se lisent sur `/admin`, après
  connexion. Le mot de passe est haché avec BCrypt (table `administrateur`),
  la session tient dans un cookie `HttpOnly` et `SameSite=Strict` (`Secure`
  en HTTPS), une nouvelle session est créée à chaque connexion (contre la
  fixation de session), et une adresse IP n'a droit qu'à 10 tentatives par
  quart d'heure. Un identifiant inconnu prend le même temps de réponse qu'un
  mauvais mot de passe, pour ne pas révéler quels comptes existent.
* **Sécurité du serveur** : nginx envoie une politique de sécurité du contenu
  (CSP : seuls les scripts servis par le site s'exécutent, aucun script en
  ligne), interdit l'affichage du site dans un cadre, masque sa version et
  ne tient aucun journal des visites. Il limite les requêtes par adresse IP,
  et la boîte de réception refuse les messages au-delà de 500 non lus. Les
  conteneurs ne peuvent pas gagner de droits et leurs journaux sont
  plafonnés. Dépendances vérifiées avec `npm audit` (aucune faille connue).
