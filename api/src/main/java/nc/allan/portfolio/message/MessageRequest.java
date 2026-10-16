package nc.allan.portfolio.message;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Ce qu'envoie le formulaire de contact.
 *
 * @param siteWeb champ piège, caché aux humains : un robot qui remplit tout
 *                se trahit en le remplissant.
 */
public record MessageRequest(
		@NotBlank(message = "Indiquez votre nom.")
		@Size(max = 100, message = "Le nom ne doit pas dépasser 100 caractères.")
		String nom,

		@NotBlank(message = "Indiquez votre adresse e-mail.")
		@Email(message = "Cette adresse e-mail n'est pas valide.")
		@Size(max = 254, message = "L'adresse e-mail est trop longue.")
		String email,

		@NotBlank(message = "Écrivez votre message.")
		@Size(min = 10, max = 5000, message = "Le message doit faire entre 10 et 5000 caractères.")
		String contenu,

		String siteWeb) {
}
