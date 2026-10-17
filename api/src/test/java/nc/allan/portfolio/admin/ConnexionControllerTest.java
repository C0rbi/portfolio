package nc.allan.portfolio.admin;

import nc.allan.portfolio.ErreursApi;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.request;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ConnexionController.class)
@Import({LimiteurConnexions.class, ConfigurationSecurite.class, SessionAdmin.class, ConfigurationWeb.class, ErreursApi.class})
@TestPropertySource(properties = "portfolio.limite.connexions=3")
class ConnexionControllerTest {

	private static final String MOT_DE_PASSE = "un-mot-de-passe-solide";

	@Autowired
	private MockMvc mvc;

	@Autowired
	private PasswordEncoder encodeur;

	@MockitoBean
	private AdministrateurRepository administrateurs;

	@BeforeEach
	void compteExistant() {
		when(administrateurs.findByIdentifiant("allan"))
				.thenReturn(Optional.of(new Administrateur("allan", encodeur.encode(MOT_DE_PASSE), Instant.now())));
	}

	/**
	 * Tentative de connexion depuis une adresse IP donnée : chaque test a la
	 * sienne, pour que la limite de tentatives de l'un ne gêne pas l'autre.
	 */
	private static MockHttpServletRequestBuilder connexion(String ip, String identifiant, String motDePasse) {
		String corps = """
				{"identifiant": "%s", "motDePasse": "%s"}
				""".formatted(identifiant, motDePasse);
		return post("/api/admin/connexion")
				.contentType(MediaType.APPLICATION_JSON)
				.content(corps)
				.with(requete -> {
					requete.setRemoteAddr(ip);
					return requete;
				});
	}

	@Test
	void lesBonsIdentifiantsOuvrentUneSession() throws Exception {
		mvc.perform(connexion("10.0.0.1", "allan", MOT_DE_PASSE))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.identifiant").value("allan"))
				.andExpect(request().sessionAttribute(SessionAdmin.ATTRIBUT, "allan"));
	}

	@Test
	void unMauvaisMotDePasseEstRefuse() throws Exception {
		mvc.perform(connexion("10.0.0.2", "allan", "pas-le-bon-mot-de-passe"))
				.andExpect(status().isUnauthorized())
				.andExpect(request().sessionAttributeDoesNotExist(SessionAdmin.ATTRIBUT));
	}

	@Test
	void unIdentifiantInconnuEstRefuseDeLaMemeFacon() throws Exception {
		mvc.perform(connexion("10.0.0.3", "inconnu", MOT_DE_PASSE))
				.andExpect(status().isUnauthorized())
				.andExpect(request().sessionAttributeDoesNotExist(SessionAdmin.ATTRIBUT));
	}

	@Test
	void desChampsVidesSontRefusesAvantToutControle() throws Exception {
		mvc.perform(connexion("10.0.0.4", "", ""))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.erreurs.identifiant").exists());
	}

	@Test
	void apresTroisTentativesLaConnexionEstBloqueeMemeAvecLeBonMotDePasse() throws Exception {
		for (int i = 0; i < 3; i++) {
			mvc.perform(connexion("10.0.0.5", "allan", "essai-" + i)).andExpect(status().isUnauthorized());
		}
		mvc.perform(connexion("10.0.0.5", "allan", MOT_DE_PASSE)).andExpect(status().isTooManyRequests());
	}

	@Test
	void laSessionDitQuiEstConnecte() throws Exception {
		mvc.perform(get("/api/admin/session")).andExpect(status().isUnauthorized());

		MockHttpSession session = new MockHttpSession();
		session.setAttribute(SessionAdmin.ATTRIBUT, "allan");
		mvc.perform(get("/api/admin/session").session(session))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.identifiant").value("allan"));
	}

	@Test
	void laDeconnexionFermeLaSession() throws Exception {
		MockHttpSession session = new MockHttpSession();
		session.setAttribute(SessionAdmin.ATTRIBUT, "allan");

		mvc.perform(post("/api/admin/deconnexion").session(session)).andExpect(status().isNoContent());

		assertThat(session.isInvalid()).isTrue();
	}
}
