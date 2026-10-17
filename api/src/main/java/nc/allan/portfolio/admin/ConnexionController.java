package nc.allan.portfolio.admin;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.util.Optional;

/**
 * Connexion à la page /admin.
 * <ul>
 *   <li>POST /api/admin/connexion : vérifie l'identifiant et le mot de passe
 *   (BCrypt), puis ouvre une session ;</li>
 *   <li>GET /api/admin/session : qui est connecté (401 si personne) ;</li>
 *   <li>POST /api/admin/deconnexion : ferme la session.</li>
 * </ul>
 * La session tient dans un cookie HttpOnly et SameSite=Strict (voir
 * application.properties) : illisible par le JavaScript, et jamais envoyé
 * depuis un autre site.
 */
@RestController
@RequestMapping("/api/admin")
public class ConnexionController {

	private final AdministrateurRepository administrateurs;
	private final PasswordEncoder encodeur;
	private final LimiteurConnexions limiteur;

	/**
	 * Empreinte d'un mot de passe quelconque. Quand l'identifiant n'existe pas,
	 * on la vérifie quand même : la réponse prend le même temps, et ne trahit
	 * donc pas quels identifiants existent.
	 */
	private final String empreinteFactice;

	public ConnexionController(
			AdministrateurRepository administrateurs, PasswordEncoder encodeur, LimiteurConnexions limiteur) {
		this.administrateurs = administrateurs;
		this.encodeur = encodeur;
		this.limiteur = limiteur;
		this.empreinteFactice = encodeur.encode("aucun-compte-ne-porte-ce-mot-de-passe");
	}

	@PostMapping("/connexion")
	public ResponseEntity<AdminConnecte> connexion(
			@Valid @RequestBody ConnexionRequest requete, HttpServletRequest http) {
		if (!limiteur.autoriser(http.getRemoteAddr())) {
			return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
		}

		Optional<Administrateur> compte = administrateurs.findByIdentifiant(requete.identifiant().strip());
		String empreinte = compte.map(Administrateur::getMotDePasse).orElse(empreinteFactice);
		// Au-delà de 72 octets, BCrypt ne compare plus rien : on refuse
		boolean lisible = requete.motDePasse().getBytes(StandardCharsets.UTF_8).length
				<= CompteAdminInitial.OCTETS_MAX;
		boolean valide = lisible && encodeur.matches(requete.motDePasse(), empreinte);
		if (!valide || compte.isEmpty()) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		// Session neuve à chaque connexion : un identifiant de session imposé
		// à l'avance par un tiers ne lui sert à rien (fixation de session)
		HttpSession ancienne = http.getSession(false);
		if (ancienne != null) {
			ancienne.invalidate();
		}
		String identifiant = compte.get().getIdentifiant();
		http.getSession(true).setAttribute(SessionAdmin.ATTRIBUT, identifiant);
		return ResponseEntity.ok(new AdminConnecte(identifiant));
	}

	@GetMapping("/session")
	public ResponseEntity<AdminConnecte> session(HttpServletRequest http) {
		return SessionAdmin.identifiant(http)
				.map(identifiant -> ResponseEntity.ok(new AdminConnecte(identifiant)))
				.orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
	}

	@PostMapping("/deconnexion")
	public ResponseEntity<Void> deconnexion(HttpServletRequest http) {
		HttpSession session = http.getSession(false);
		if (session != null) {
			session.invalidate();
		}
		return ResponseEntity.noContent().build();
	}
}
