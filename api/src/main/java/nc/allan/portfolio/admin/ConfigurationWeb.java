package nc.allan.portfolio.admin;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/** Branche le contrôle de la session administrateur sur les routes des messages. */
@Configuration
public class ConfigurationWeb implements WebMvcConfigurer {

	private final SessionAdmin sessionAdmin;

	public ConfigurationWeb(SessionAdmin sessionAdmin) {
		this.sessionAdmin = sessionAdmin;
	}

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(sessionAdmin).addPathPatterns("/api/messages", "/api/messages/**");
	}
}
