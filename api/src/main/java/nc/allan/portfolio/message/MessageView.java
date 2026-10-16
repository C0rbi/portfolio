package nc.allan.portfolio.message;

/** Un message tel que l'affiche la page /admin (date au format ISO 8601). */
public record MessageView(long id, String nom, String email, String contenu, String creeLe, boolean lu) {

	static MessageView de(Message message) {
		return new MessageView(
				message.getId(),
				message.getNom(),
				message.getEmail(),
				message.getContenu(),
				message.getCreeLe().toString(),
				message.isLu());
	}
}
