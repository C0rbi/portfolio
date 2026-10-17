# Mise en ligne

Tout tourne dans Docker : cloner le dépôt, remplir un fichier `.env`, lancer
`docker compose`. Rien d'autre à installer (ni Java, ni Node, ni MySQL).

## Ce qui tourne

| Service | Rôle | Port |
| --- | --- | --- |
| `web` | nginx : sert le site Angular et relaie `/api` vers l'API | `WEB_PORT`, le seul publié |
| `api` | Spring Boot (Java 21) : formulaire de contact et page `/admin` | interne |
| `db` | MySQL 8.4 : les messages, dans le volume `db-data` | interne |

Les images sont construites sur le serveur au lancement (`--build`).

## Prérequis

* Docker Engine avec le plugin Compose (`docker compose version` doit répondre)
* git (si le dépôt est privé, Allan doit vous y donner accès)
* environ 1 Go de RAM libre : mesuré au repos, MySQL occupe 450 Mo, l'API
  400 Mo et nginx 20 Mo

## Première installation

```bash
git clone https://github.com/C0rbi/portfolio.git
cd portfolio
cp .env.example .env
```

Remplir `.env` : tant qu'une valeur manque, `docker compose` refuse de
démarrer. Pour générer des valeurs solides :

```bash
openssl rand -base64 24                  # un mot de passe (DB_*, ADMIN_PASSWORD)
echo "ancre-$(openssl rand -hex 5)"      # un identifiant pour ADMIN_USERNAME
```

| Variable | Rôle |
| --- | --- |
| `DB_PASSWORD` | mot de passe MySQL utilisé par l'API |
| `DB_ROOT_PASSWORD` | mot de passe root de MySQL (sauvegardes) |
| `ADMIN_USERNAME` | identifiant du compte de la page `/admin`, difficile à deviner (ni `admin`, ni un prénom) |
| `ADMIN_PASSWORD` | son mot de passe (12 caractères au moins) : à transmettre à Allan, en privé |
| `WEB_PORT` | port publié sur le serveur (voir HTTPS plus bas) |

Puis lancer :

```bash
docker compose up -d --build
docker compose ps
```

Le premier build prend quelques minutes (dépendances Maven et npm, tests de
l'API). `db` passe en `healthy`, puis `api` démarre. Le site répond ensuite
sur `http://<serveur>:<WEB_PORT>`.

> Les mots de passe MySQL ne sont lus qu'au tout premier lancement, quand la
> base est créée. Les changer ensuite dans `.env` ne change pas ceux de MySQL,
> et l'API ne pourrait plus se connecter.

## Compte administrateur

Les messages se lisent sur `https://<domaine>/admin`, avec `ADMIN_USERNAME`
et `ADMIN_PASSWORD`. À chaque démarrage, l'API aligne le compte sur le
`.env` : elle le crée s'il n'existe pas, et met à jour son mot de passe s'il
a changé. Seule l'empreinte BCrypt du mot de passe est enregistrée, dans la
table `administrateur`.

* Changer le mot de passe : modifier `ADMIN_PASSWORD` dans `.env`, puis
  `docker compose up -d`.
* Après 10 tentatives de connexion en 15 minutes, une adresse IP doit
  patienter. Redémarrer l'API (`docker compose restart api`) lève aussi le
  blocage.

> Site installé avant le compte administrateur (avec `ADMIN_TOKEN`) :
> remplacer cette ligne du `.env` par `ADMIN_USERNAME` et `ADMIN_PASSWORD`,
> puis `git pull` et `docker compose up -d --build`. La nouvelle table est
> créée toute seule et les messages sont conservés.

## HTTPS

`web` parle en HTTP. Le mot de passe de `/admin` et les messages ne doivent
pas circuler en clair : en production, placer le site derrière le reverse proxy
du serveur, qui gère le certificat. Dans `.env`, ne publier le site qu'en
local :

```dotenv
WEB_PORT=127.0.0.1:8081
```

Avec Caddy :

```
portfolio.exemple.nc {
    reverse_proxy 127.0.0.1:8081
}
```

Avec nginx :

```nginx
location / {
    proxy_pass http://127.0.0.1:8081;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

* `X-Forwarded-For` sert aux limites par adresse IP (messages, tentatives de
  connexion) : sans lui, tous les visiteurs auraient l'adresse du proxy.
* `X-Forwarded-Proto` indique à l'API que le site est en HTTPS : son cookie
  de session est alors marqué `Secure`.

Caddy envoie les deux de lui-même. Une fois le site servi en HTTPS, il
envoie aussi de lui-même l'en-tête HSTS (le navigateur n'acceptera plus que
HTTPS pendant un an).

Si le reverse proxy tourne lui-même dans un conteneur (Traefik, Nginx Proxy
Manager…), `127.0.0.1` désigne ce conteneur : le brancher plutôt sur le réseau
`portfolio_default` et viser `http://web:80`.

## Sécurité

Ce que le site fait déjà de lui-même :

* en-têtes de sécurité sur toutes les réponses : CSP (seuls les scripts du
  site s'exécutent), interdiction d'afficher le site dans un cadre,
  `nosniff`, HSTS en HTTPS ; la version de nginx n'est jamais affichée ;
* limites par adresse IP : 5 requêtes par seconde vers l'API, 30 connexions
  simultanées, 5 messages toutes les 10 minutes, 10 tentatives de connexion
  à `/admin` toutes les 15 minutes ; au-delà de 500 messages non lus, les
  nouveaux sont refusés (le disque ne peut pas être rempli) ;
* seul le port de `web` est publié : MySQL et l'API ne sont pas joignables
  depuis l'extérieur ; aucun conteneur ne peut gagner de droits ;
* journaux Docker limités à 3 × 10 Mo par service, et aucun journal des
  visites (les adresses IP ne sont pas conservées).

À faire sur le serveur :

* HTTPS obligatoire (voir plus haut) ;
* pare-feu : n'ouvrir que les ports 80, 443 et SSH ;
* SSH par clé plutôt que par mot de passe ;
* mises à jour régulières du système, et des images une fois par mois
  (dernière ligne du tableau « Commandes utiles »).

## Mettre à jour le site

```bash
cd portfolio
git pull
docker compose up -d --build
```

Seuls les conteneurs modifiés sont recréés. Les messages restent dans le
volume `db-data`.

## Sauvegarder les messages

```bash
docker compose exec -T db sh -c 'mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" portfolio' > portfolio-$(date +%F).sql
```

L'avertissement « Using a password on the command line interface can be
insecure » est normal : il s'affiche dans le terminal, pas dans le fichier.

Restaurer une sauvegarde (remplace la table par celle du fichier) :

```bash
docker compose exec -T db sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" portfolio' < portfolio-AAAA-MM-JJ.sql
```

## Commandes utiles

| Commande | Effet |
| --- | --- |
| `docker compose ps` | état des trois services |
| `docker compose logs -f api` | journaux de l'API |
| `docker compose up -d` | applique un `.env` modifié (mot de passe admin, port) |
| `docker compose down` | arrête tout ; les messages sont conservés |
| `docker compose down -v` | arrête tout **et supprime la base** |
| `docker compose build --pull && docker compose pull db && docker compose up -d` | récupère les correctifs de sécurité des images de base |

Les conteneurs redémarrent seuls après un redémarrage du serveur
(`restart: unless-stopped`), si Docker est lancé au démarrage.
