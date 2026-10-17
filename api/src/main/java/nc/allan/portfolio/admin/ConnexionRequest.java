package nc.allan.portfolio.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Ce que saisit l'administrateur sur la page /admin. */
public record ConnexionRequest(
		@NotBlank(message = "Indiquez votre identifiant.")
		@Size(max = 50)
		String identifiant,

		@NotBlank(message = "Indiquez votre mot de passe.")
		@Size(max = 200)
		String motDePasse) {
}
