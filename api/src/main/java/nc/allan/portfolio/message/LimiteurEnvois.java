package nc.allan.portfolio.message;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.HashMap;
import java.util.Map;

/**
 * Limite le nombre de messages par adresse IP sur une fenêtre glissante
 * (5 toutes les 10 minutes par défaut), contre les envois en rafale.
 * Tout reste en mémoire : les adresses ne sont jamais enregistrées.
 */
@Component
public class LimiteurEnvois {

	private final int maximum;
	private final Duration fenetre;
	private final Map<String, Deque<Instant>> envois = new HashMap<>();

	public LimiteurEnvois(
			@Value("${portfolio.limite.envois:5}") int maximum,
			@Value("${portfolio.limite.fenetre:PT10M}") Duration fenetre) {
		this.maximum = maximum;
		this.fenetre = fenetre;
	}

	/** Vrai si cette adresse peut encore envoyer un message maintenant. */
	public boolean autoriser(String adresse) {
		return autoriser(adresse, Instant.now());
	}

	synchronized boolean autoriser(String adresse, Instant maintenant) {
		Instant limite = maintenant.minus(fenetre);

		// Ménage : on oublie les envois sortis de la fenêtre, et les adresses
		// qui n'ont plus rien de récent
		for (Deque<Instant> recents : envois.values()) {
			while (!recents.isEmpty() && recents.peekFirst().isBefore(limite)) {
				recents.pollFirst();
			}
		}
		envois.values().removeIf(Deque::isEmpty);

		Deque<Instant> recents = envois.computeIfAbsent(adresse, a -> new ArrayDeque<>());
		if (recents.size() >= maximum) {
			return false;
		}
		recents.addLast(maintenant);
		return true;
	}
}
