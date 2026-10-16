package nc.allan.portfolio.message;

import org.junit.jupiter.api.Test;

import java.time.Duration;
import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;

class LimiteurEnvoisTest {

	private final Instant debut = Instant.parse("2026-10-15T09:00:00Z");

	@Test
	void auDelaDuMaximumLesEnvoisSontRefusesPuisRedeviennentPossibles() {
		LimiteurEnvois limiteur = new LimiteurEnvois(2, Duration.ofMinutes(10));

		assertThat(limiteur.autoriser("203.0.113.7", debut)).isTrue();
		assertThat(limiteur.autoriser("203.0.113.7", debut.plusSeconds(30))).isTrue();
		assertThat(limiteur.autoriser("203.0.113.7", debut.plusSeconds(60))).isFalse();

		// Une autre adresse n'est pas concernée
		assertThat(limiteur.autoriser("198.51.100.4", debut.plusSeconds(60))).isTrue();

		// Fenêtre écoulée : les anciens envois sont oubliés
		assertThat(limiteur.autoriser("203.0.113.7", debut.plus(Duration.ofMinutes(11)))).isTrue();
	}
}
