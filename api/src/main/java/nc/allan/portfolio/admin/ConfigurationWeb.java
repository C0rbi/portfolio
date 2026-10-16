package nc.allan.portfolio.admin;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/** Branche le contrôle du jeton administrateur sur les routes des messages. */
@Configuration
public class ConfigurationWeb implements WebMvcConfigurer {

	private final JetonAdmin jetonAdmin;

	public ConfigurationWeb(JetonAdmin jetonAdmin) {
		this.jetonAdmin = jetonAdmin;
	}

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(jetonAdmin).addPathPatterns("/api/messages", "/api/messages/**");
	}
}
