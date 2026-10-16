package nc.allan.portfolio;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Formulaire invalide : réponse 400 avec un message par champ, que le site
 * affiche sous le champ concerné. Exemple : {"erreurs": {"email": "…"}}
 */
@RestControllerAdvice
public class ErreursApi {

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, Map<String, String>>> invalide(MethodArgumentNotValidException exception) {
		Map<String, String> champs = new LinkedHashMap<>();
		exception.getBindingResult().getFieldErrors()
				.forEach(erreur -> champs.putIfAbsent(erreur.getField(), erreur.getDefaultMessage()));
		return ResponseEntity.badRequest().body(Map.of("erreurs", champs));
	}
}
