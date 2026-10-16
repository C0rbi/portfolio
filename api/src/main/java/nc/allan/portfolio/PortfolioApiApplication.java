package nc.allan.portfolio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * API du portfolio. Une seule ressource : les messages laissés depuis le
 * formulaire de contact, enregistrés dans MySQL et lus depuis la page /admin.
 */
@SpringBootApplication
public class PortfolioApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(PortfolioApiApplication.class, args);
	}
}
