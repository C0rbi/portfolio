package nc.allan.portfolio.admin;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.time.Instant;

/**
 * Au démarrage, aligne le compte de la page /admin sur le fichier .env
 * (ADMIN_USERNAME et ADMIN_PASSWORD) :
 * <ul>
 *   <li>le compte est créé s'il n'existe pas encore ;</li>
 *   <li>son mot de passe est mis à jour s'il a changé dans .env ;</li>
 *   <li>un compte à un autre nom (identifiant changé dans .env) est supprimé,
 *   sinon il resterait utilisable avec son ancien mot de passe.</li>
 * </ul>
 * Seule l'empreinte BCrypt du mot de passe est enregistrée en base.
 */
@Component
public class CompteAdminInitial implements ApplicationRunner {

	private static final Logger log = LoggerFactory.getLogger(CompteAdminInitial.class);

	static final int LONGUEUR_MIN = 12;
	/** BCrypt ne tient compte que des 72 premiers octets d'un mot de passe. */
	static final int OCTETS_MAX = 72;

	private final AdministrateurRepository administrateurs;
	private final PasswordEncoder encodeur;
	private final String identifiant;
	private final String motDePasse;

	public CompteAdminInitial(
			AdministrateurRepository administrateurs,
			PasswordEncoder encodeur,
			@Value("${portfolio.admin.identifiant}") String identifiant,
			@Value("${portfolio.admin.mot-de-passe}") String motDePasse) {
		this.administrateurs = administrateurs;
		this.encodeur = encodeur;
		this.identifiant = identifiant.strip();
		this.motDePasse = motDePasse;
	}

	@Override
	public void run(ApplicationArguments arguments) {
		if (identifiant.isEmpty() || motDePasse.isEmpty()) {
			log.warn("ADMIN_USERNAME ou ADMIN_PASSWORD vide : aucun compte, la page /admin reste fermée.");
			return;
		}
		if (motDePasse.length() < LONGUEUR_MIN || motDePasse.getBytes(StandardCharsets.UTF_8).length > OCTETS_MAX) {
			log.error("ADMIN_PASSWORD doit faire au moins {} caractères (et au plus {} octets) : compte inchangé.",
					LONGUEUR_MIN, OCTETS_MAX);
			return;
		}

		Administrateur compte = null;
		for (Administrateur existant : administrateurs.findAll()) {
			if (compte == null && existant.getIdentifiant().equalsIgnoreCase(identifiant)) {
				compte = existant;
			} else {
				administrateurs.delete(existant);
				log.info("Ancien compte administrateur « {} » supprimé.", existant.getIdentifiant());
			}
		}

		if (compte == null) {
			administrateurs.save(new Administrateur(identifiant, encodeur.encode(motDePasse), Instant.now()));
			log.info("Compte administrateur « {} » créé.", identifiant);
		} else if (!encodeur.matches(motDePasse, compte.getMotDePasse())) {
			compte.changerMotDePasse(encodeur.encode(motDePasse));
			administrateurs.save(compte);
			log.info("Mot de passe du compte « {} » mis à jour depuis ADMIN_PASSWORD.", identifiant);
		}
	}
}
