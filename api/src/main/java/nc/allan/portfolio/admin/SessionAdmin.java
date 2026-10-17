package nc.allan.portfolio.admin;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Optional;

/**
 * Protège la lecture et la gestion des messages : il faut une session ouverte
 * par ConnexionController. L'envoi d'un message (POST) reste public.
 * <p>
 * Une modification (PATCH, DELETE) demandée depuis un autre site, même un
 * sous-domaine voisin, est refusée, cookie ou pas. Le navigateur annonce la
 * provenance d'une requête dans l'en-tête Sec-Fetch-Site ; s'il ne l'envoie
 * pas (navigateur ancien), le cookie SameSite=Strict protège déjà.
 */
@Component
public class SessionAdmin implements HandlerInterceptor {

	/** Attribut de session posé à la connexion : l'identifiant de l'administrateur. */
	public static final String ATTRIBUT = "administrateur";

	/** Identifiant de l'administrateur connecté pour cette requête, s'il y en a un. */
	static Optional<String> identifiant(HttpServletRequest requete) {
		HttpSession session = requete.getSession(false);
		if (session == null) {
			return Optional.empty();
		}
		return Optional.ofNullable((String) session.getAttribute(ATTRIBUT));
	}

	@Override
	public boolean preHandle(HttpServletRequest requete, HttpServletResponse reponse, Object handler) {
		String methode = requete.getMethod();
		if ("POST".equals(methode)) {
			return true;
		}

		boolean lecture = "GET".equals(methode) || "HEAD".equals(methode);
		String provenance = requete.getHeader("Sec-Fetch-Site");
		if (!lecture && provenance != null && !"same-origin".equals(provenance)) {
			reponse.setStatus(HttpServletResponse.SC_FORBIDDEN);
			return false;
		}

		if (identifiant(requete).isPresent()) {
			return true;
		}
		reponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
		return false;
	}
}
