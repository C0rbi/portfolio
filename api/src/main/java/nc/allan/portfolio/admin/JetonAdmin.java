package nc.allan.portfolio.admin;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

/**
 * Protège la lecture et la gestion des messages : l'en-tête
 * « Authorization: Bearer <jeton> » doit contenir le jeton défini dans la
 * variable d'environnement ADMIN_TOKEN. Sans jeton configuré, tout est refusé.
 * L'envoi d'un message (POST) reste public.
 */
@Component
public class JetonAdmin implements HandlerInterceptor {

	private static final String PREFIXE = "Bearer ";

	private final byte[] jeton;

	public JetonAdmin(@Value("${portfolio.admin-token:}") String jeton) {
		this.jeton = jeton.getBytes(StandardCharsets.UTF_8);
	}

	@Override
	public boolean preHandle(HttpServletRequest requete, HttpServletResponse reponse, Object handler) {
		if ("POST".equals(requete.getMethod())) {
			return true;
		}

		String entete = requete.getHeader(HttpHeaders.AUTHORIZATION);
		if (jeton.length > 0 && entete != null && entete.startsWith(PREFIXE)) {
			byte[] recu = entete.substring(PREFIXE.length()).getBytes(StandardCharsets.UTF_8);
			// Comparaison à temps constant : la durée ne trahit pas le jeton
			if (MessageDigest.isEqual(jeton, recu)) {
				return true;
			}
		}

		reponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
		return false;
	}
}
