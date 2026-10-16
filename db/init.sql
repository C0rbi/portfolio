-- =============================================================
--  Base du portfolio : exécuté une seule fois par MySQL, à la
--  création du volume (docker-entrypoint-initdb.d), dans la base
--  MYSQL_DATABASE du docker-compose.
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
