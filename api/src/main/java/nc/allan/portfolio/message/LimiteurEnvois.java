package nc.allan.portfolio.message;

import nc.allan.portfolio.FenetreGlissante;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Duration;

/** Messages du formulaire de contact : 5 par adresse IP toutes les 10 minutes (par défaut). */
@Component
public class LimiteurEnvois extends FenetreGlissante {

	public LimiteurEnvois(
			@Value("${portfolio.limite.envois:5}") int maximum,
			@Value("${portfolio.limite.fenetre:PT10M}") Duration fenetre) {
		super(maximum, fenetre);
	}
}
