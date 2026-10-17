-- =============================================================
--  Schéma de la base du portfolio. L'API le rejoue à chaque
--  démarrage (spring.sql.init.mode=always) : grâce aux
--  « IF NOT EXISTS », il est sans effet sur une base déjà prête,
--  et une nouvelle table apparaît d'elle-même.
-- =============================================================

-- Messages laissés depuis le formulaire de contact
CREATE TABLE IF NOT EXISTS message (
  id       BIGINT        NOT NULL AUTO_INCREMENT,
  nom      VARCHAR(100)  NOT NULL,
  email    VARCHAR(254)  NOT NULL,
  contenu  VARCHAR(5000) NOT NULL,
  cree_le  DATETIME(6)   NOT NULL,
  lu       BOOLEAN       NOT NULL DEFAULT FALSE,
  PRIMARY KEY (id),
  INDEX idx_message_cree_le (cree_le)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Compte de la page /admin : le mot de passe n'est jamais stocké, seulement
-- son empreinte BCrypt (60 caractères, sel compris)
CREATE TABLE IF NOT EXISTS administrateur (
  id            BIGINT       NOT NULL AUTO_INCREMENT,
  identifiant   VARCHAR(50)  NOT NULL,
  mot_de_passe  CHAR(60)     NOT NULL,
  cree_le       DATETIME(6)  NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_administrateur_identifiant (identifiant)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
