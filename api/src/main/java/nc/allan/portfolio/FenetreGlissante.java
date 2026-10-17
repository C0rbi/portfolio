package nc.allan.portfolio;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.HashMap;
import java.util.Map;

/**
 * Au plus N actions par adresse IP sur une fenêtre glissante (par exemple 5
 * messages toutes les 10 minutes), contre les envois en rafale et les essais
 * de mots de passe à la chaîne. Tout reste en mémoire : les adresses ne sont
 * jamais enregistrées.
 */
public class FenetreGlissante {

	/**
	 * Adresses suivies en même temps, au plus. Au-delà (attaque venue de très
	 * nombreuses adresses), les nouvelles sont refusées : la mémoire du
	 * serveur reste bornée.
	 */
	static final int ADRESSES_MAX = 10_000;

	private final int maximum;
	private final Duration fenetre;
	private final int adressesMax;
	private final Map<String, Deque<Instant>> actions = new HashMap<>();

	public FenetreGlissante(int maximum, Duration fenetre) {
		this(maximum, fenetre, ADRESSES_MAX);
	}

	FenetreGlissante(int maximum, Duration fenetre, int adressesMax) {
		this.maximum = maximum;
		this.fenetre = fenetre;
		this.adressesMax = adressesMax;
	}

	/** Vrai si cette adresse peut encore agir maintenant ; l'action est alors comptée. */
	public boolean autoriser(String adresse) {
		return autoriser(adresse, Instant.now());
	}

	synchronized boolean autoriser(String adresse, Instant maintenant) {
		Instant limite = maintenant.minus(fenetre);

		// Ménage : on oublie les actions sorties de la fenêtre, et les adresses
		// qui n'ont plus rien de récent
		for (Deque<Instant> recentes : actions.values()) {
			while (!recentes.isEmpty() && recentes.peekFirst().isBefore(limite)) {
				recentes.pollFirst();
			}
		}
		actions.values().removeIf(Deque::isEmpty);

		Deque<Instant> recentes = actions.get(adresse);
		if (recentes == null) {
			if (actions.size() >= adressesMax) {
				return false;
			}
			recentes = new ArrayDeque<>();
			actions.put(adresse, recentes);
		}
		if (recentes.size() >= maximum) {
			return false;
		}
		recentes.addLast(maintenant);
		return true;
	}
}
