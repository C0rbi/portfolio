package nc.allan.portfolio.admin;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

class CompteAdminInitialTest {

	private static final String MOT_DE_PASSE = "un-mot-de-passe-solide";

	private final AdministrateurRepository administrateurs = mock(AdministrateurRepository.class);
	// Coût réduit : les tests restent rapides, le principe est le même
	private final PasswordEncoder encodeur = new BCryptPasswordEncoder(4);

	private void demarrer(String identifiant, String motDePasse) {
		new CompteAdminInitial(administrateurs, encodeur, identifiant, motDePasse).run(null);
	}

	@Test
	void creeLeCompteAvecUneEmpreinteEtJamaisLeMotDePasse() {
		when(administrateurs.findAll()).thenReturn(List.of());

		demarrer("allan", MOT_DE_PASSE);

		ArgumentCaptor<Administrateur> cree = ArgumentCaptor.forClass(Administrateur.class);
		verify(administrateurs).save(cree.capture());
		assertThat(cree.getValue().getIdentifiant()).isEqualTo("allan");
		assertThat(cree.getValue().getMotDePasse()).startsWith("$2").doesNotContain(MOT_DE_PASSE);
		assertThat(encodeur.matches(MOT_DE_PASSE, cree.getValue().getMotDePasse())).isTrue();
	}

	@Test
	void metAJourLeMotDePasseQuandIlChangeDansLeFichierEnv() {
		Administrateur compte = new Administrateur("allan", encodeur.encode("ancien-mot-de-passe"), Instant.now());
		when(administrateurs.findAll()).thenReturn(List.of(compte));

		demarrer("allan", MOT_DE_PASSE);

		verify(administrateurs).save(compte);
		assertThat(encodeur.matches(MOT_DE_PASSE, compte.getMotDePasse())).isTrue();
	}

	@Test
	void neTouchePasAUnCompteDejaAJour() {
		Administrateur compte = new Administrateur("allan", encodeur.encode(MOT_DE_PASSE), Instant.now());
		when(administrateurs.findAll()).thenReturn(List.of(compte));

		demarrer("allan", MOT_DE_PASSE);

		verify(administrateurs, never()).save(any());
		verify(administrateurs, never()).delete(any());
	}

	@Test
	void supprimeLeCompteDUnAncienIdentifiant() {
		Administrateur ancien = new Administrateur("ancien", encodeur.encode(MOT_DE_PASSE), Instant.now());
		when(administrateurs.findAll()).thenReturn(List.of(ancien));

		demarrer("allan", MOT_DE_PASSE);

		verify(administrateurs).delete(ancien);
		verify(administrateurs).save(any(Administrateur.class));
	}

	@Test
	void refuseUnMotDePasseTropCourt() {
		demarrer("allan", "trop-court");

		verifyNoInteractions(administrateurs);
	}

	@Test
	void sansMotDePasseLaPageAdminResteFermee() {
		demarrer("allan", "");

		verifyNoInteractions(administrateurs);
	}
}
