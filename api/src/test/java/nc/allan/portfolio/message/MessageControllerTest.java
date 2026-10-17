package nc.allan.portfolio.message;

import nc.allan.portfolio.ErreursApi;
import nc.allan.portfolio.admin.ConfigurationWeb;
import nc.allan.portfolio.admin.SessionAdmin;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MessageController.class)
@Import({LimiteurEnvois.class, SessionAdmin.class, ConfigurationWeb.class, ErreursApi.class})
class MessageControllerTest {

	private static final String MESSAGE_VALIDE = """
			{"nom": "Jeanne", "email": "jeanne@exemple.nc", "contenu": "Bonjour, une question sur votre projet LDNC."}
			""";

	@Autowired
	private MockMvc mvc;

	@MockitoBean
	private MessageRepository messages;

	/** Session telle que l'ouvre ConnexionController après une connexion réussie. */
	private static MockHttpSession sessionAdmin() {
		MockHttpSession session = new MockHttpSession();
		session.setAttribute(SessionAdmin.ATTRIBUT, "allan");
		return session;
	}

	@Test
	void unMessageValideEstEnregistre() throws Exception {
		mvc.perform(post("/api/messages").contentType(MediaType.APPLICATION_JSON).content(MESSAGE_VALIDE))
				.andExpect(status().isCreated());

		verify(messages).save(any(Message.class));
	}

	@Test
	void uneAdresseInvalideEstRefuseeAvecUnMessageParChamp() throws Exception {
		String invalide = """
				{"nom": "Jeanne", "email": "pas-une-adresse", "contenu": "Bonjour, une question."}
				""";

		mvc.perform(post("/api/messages").contentType(MediaType.APPLICATION_JSON).content(invalide))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.erreurs.email").exists());

		verify(messages, never()).save(any());
	}

	@Test
	void leChampPiegeRempliNEnregistreRien() throws Exception {
		String robot = """
				{"nom": "Bot", "email": "bot@exemple.com", "contenu": "Achetez maintenant !!!", "siteWeb": "http://spam"}
				""";

		mvc.perform(post("/api/messages").contentType(MediaType.APPLICATION_JSON).content(robot))
				.andExpect(status().isAccepted());

		verify(messages, never()).save(any());
	}

	@Test
	void quandLaBoiteEstPleineLesNouveauxMessagesSontRefuses() throws Exception {
		when(messages.countByLuFalse()).thenReturn(500L);

		mvc.perform(post("/api/messages").contentType(MediaType.APPLICATION_JSON).content(MESSAGE_VALIDE))
				.andExpect(status().isServiceUnavailable());

		verify(messages, never()).save(any());
	}

	@Test
	void sansConnexionLesMessagesRestentFermes() throws Exception {
		mvc.perform(get("/api/messages")).andExpect(status().isUnauthorized());
		// Une session sans administrateur connecté ne suffit pas
		mvc.perform(get("/api/messages").session(new MockHttpSession())).andExpect(status().isUnauthorized());
		mvc.perform(delete("/api/messages/1")).andExpect(status().isUnauthorized());

		verify(messages, never()).deleteById(any());
	}

	@Test
	void uneSuppressionDemandeeDepuisUnAutreSiteEstRefusee() throws Exception {
		// Même avec la session (cookie), un autre site, même voisin, n'y a pas droit
		mvc.perform(delete("/api/messages/1").session(sessionAdmin()).header("Sec-Fetch-Site", "cross-site"))
				.andExpect(status().isForbidden());
		mvc.perform(delete("/api/messages/1").session(sessionAdmin()).header("Sec-Fetch-Site", "same-site"))
				.andExpect(status().isForbidden());

		verify(messages, never()).deleteById(any());
	}

	@Test
	void connecteLAdministrateurSupprimeUnMessageDepuisLeSite() throws Exception {
		when(messages.existsById(1L)).thenReturn(true);

		mvc.perform(delete("/api/messages/1").session(sessionAdmin()).header("Sec-Fetch-Site", "same-origin"))
				.andExpect(status().isNoContent());

		verify(messages).deleteById(1L);
	}

	@Test
	void connecteLAdministrateurVoitLesMessages() throws Exception {
		Message message = new Message("Jeanne", "jeanne@exemple.nc", "Bonjour !", Instant.parse("2026-10-15T09:00:00Z"));
		// En vrai, c'est MySQL qui attribue l'identifiant à l'enregistrement.
		ReflectionTestUtils.setField(message, "id", 1L);
		when(messages.findAllByOrderByCreeLeDesc()).thenReturn(List.of(message));

		mvc.perform(get("/api/messages").session(sessionAdmin()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].id").value(1))
				.andExpect(jsonPath("$[0].nom").value("Jeanne"))
				.andExpect(jsonPath("$[0].lu").value(false));
	}
}
