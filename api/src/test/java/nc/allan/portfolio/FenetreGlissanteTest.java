package nc.allan.portfolio;

import org.junit.jupiter.api.Test;

import java.time.Duration;
import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;

class FenetreGlissanteTest {

	private final Instant debut = Instant.parse("2026-10-15T09:00:00Z");

	@Test
	void auDelaDuMaximumLesActionsSontRefuseesPuisRedeviennentPossibles() {
		FenetreGlissante limiteur = new FenetreGlissante(2, Duration.ofMinutes(10));

		assertThat(limiteur.autoriser("203.0.113.7", debut)).isTrue();
		assertThat(limiteur.autoriser("203.0.113.7", debut.plusSeconds(30))).isTrue();
		assertThat(limiteur.autoriser("203.0.113.7", debut.plusSeconds(60))).isFalse();

		// Une autre adresse n'est pas concernée
		assertThat(limiteur.autoriser("198.51.100.4", debut.plusSeconds(60))).isTrue();

		// Fenêtre écoulée : les anciennes actions sont oubliées
		assertThat(limiteur.autoriser("203.0.113.7", debut.plus(Duration.ofMinutes(11)))).isTrue();
	}

	@Test
	void auDelaDuNombreDAdressesSuiviesLesNouvellesSontRefusees() {
		FenetreGlissante limiteur = new FenetreGlissante(5, Duration.ofMinutes(10), 2);

		assertThat(limiteur.autoriser("203.0.113.1", debut)).isTrue();
		assertThat(limiteur.autoriser("203.0.113.2", debut)).isTrue();
		// La mémoire est pleine : une troisième adresse attend son tour…
		assertThat(limiteur.autoriser("203.0.113.3", debut)).isFalse();
		// … mais les adresses déjà suivies continuent normalement
		assertThat(limiteur.autoriser("203.0.113.1", debut.plusSeconds(1))).isTrue();

		// Fenêtre écoulée : la place se libère
		assertThat(limiteur.autoriser("203.0.113.3", debut.plus(Duration.ofMinutes(11)))).isTrue();
	}
}
