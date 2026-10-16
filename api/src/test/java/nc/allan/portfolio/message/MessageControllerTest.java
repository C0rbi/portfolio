package nc.allan.portfolio.message;

import nc.allan.portfolio.ErreursApi;
import nc.allan.portfolio.admin.ConfigurationWeb;
import nc.allan.portfolio.admin.JetonAdmin;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MessageController.class)
@Import({LimiteurEnvois.class, JetonAdmin.class, ConfigurationWeb.class, ErreursApi.class})
@TestPropertySource(properties = "portfolio.admin-token=jeton-de-test")
class MessageControllerTest {

	private static final String MESSAGE_VALIDE = """
			{"nom": "Jeanne", "email": "jeanne@exemple.nc", "contenu": "Bonjour, une question sur votre projet LDNC."}
			""";

	@Autowired
	private MockMvc mvc;

	@MockitoBean
	private MessageRepository messages;

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
	void laLectureDesMessagesExigeLeJeton() throws Exception {
		mvc.perform(get("/api/messages")).andExpect(status().isUnauthorized());
		mvc.perform(get("/api/messages").header("Authorization", "Bearer mauvais-jeton"))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void avecLeJetonLesMessagesSontListes() throws Exception {
		Message message = new Message("Jeanne", "jeanne@exemple.nc", "Bonjour !", Instant.parse("2026-10-15T09:00:00Z"));
		// En vrai, c'est MySQL qui attribue l'identifiant à l'enregistrement.
		ReflectionTestUtils.setField(message, "id", 1L);
		when(messages.findAllByOrderByCreeLeDesc()).thenReturn(List.of(message));

		mvc.perform(get("/api/messages").header("Authorization", "Bearer jeton-de-test"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$[0].id").value(1))
				.andExpect(jsonPath("$[0].nom").value("Jeanne"))
				.andExpect(jsonPath("$[0].lu").value(false));
	}
}
