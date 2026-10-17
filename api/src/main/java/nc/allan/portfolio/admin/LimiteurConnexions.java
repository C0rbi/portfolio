package nc.allan.portfolio.admin;

import nc.allan.portfolio.FenetreGlissante;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Duration;

/** Tentatives de connexion à /admin : 10 par adresse IP toutes les 15 minutes (par défaut). */
@Component
public class LimiteurConnexions extends FenetreGlissante {

	public LimiteurConnexions(
			@Value("${portfolio.limite.connexions:10}") int maximum,
			@Value("${portfolio.limite.connexions-fenetre:PT15M}") Duration fenetre) {
		super(maximum, fenetre);
	}
}
