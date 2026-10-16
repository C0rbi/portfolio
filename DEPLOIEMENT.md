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

Remplir `.env` en changeant toutes les valeurs. Pour générer un secret :
`openssl rand -hex 32`.

| Variable | Rôle |
| --- | --- |
| `DB_PASSWORD` | mot de passe MySQL utilisé par l'API |
| `DB_ROOT_PASSWORD` | mot de passe root de MySQL (sauvegardes) |
| `ADMIN_TOKEN` | jeton pour lire les messages sur `/admin` : à transmettre à Allan, en privé |
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

## HTTPS

`web` parle en HTTP. Le jeton de `/admin` et les messages ne doivent pas
circuler en clair : en production, placer le site derrière le reverse proxy
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
}
```

`X-Forwarded-For` sert à la limite anti-spam (5 messages par adresse IP
toutes les 10 minutes) : sans lui, tous les visiteurs auraient l'adresse du
proxy. Caddy l'envoie de lui-même.

Si le reverse proxy tourne lui-même dans un conteneur (Traefik, Nginx Proxy
Manager…), `127.0.0.1` désigne ce conteneur : le brancher plutôt sur le réseau
`portfolio_default` et viser `http://web:80`.

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
| `docker compose up -d` | applique un `.env` modifié (nouveau jeton, autre port) |
| `docker compose down` | arrête tout ; les messages sont conservés |
| `docker compose down -v` | arrête tout **et supprime la base** |
| `docker compose build --pull && docker compose pull db && docker compose up -d` | récupère les correctifs de sécurité des images de base |

Les conteneurs redémarrent seuls après un redémarrage du serveur
(`restart: unless-stopped`), si Docker est lancé au démarrage.
