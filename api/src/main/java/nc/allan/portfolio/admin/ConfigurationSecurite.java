package nc.allan.portfolio.admin;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Hachage des mots de passe avec BCrypt : un sel aléatoire par mot de passe
 * et un calcul volontairement lent, qui freine les essais en masse si la
 * base venait à fuiter.
 */
@Configuration
public class ConfigurationSecurite {

	@Bean
	PasswordEncoder encodeurMotsDePasse() {
		return new BCryptPasswordEncoder();
	}
}
