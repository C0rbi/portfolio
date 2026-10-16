package nc.allan.portfolio.message;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;

/**
 * Messages du formulaire de contact.
 * <ul>
 *   <li>POST : public (validé, champ piège, limite par adresse IP) ;</li>
 *   <li>GET, PATCH, DELETE : réservés à la page /admin (voir JetonAdmin).</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/messages")
public class MessageController {

	private final MessageRepository messages;
	private final LimiteurEnvois limiteur;

	public MessageController(MessageRepository messages, LimiteurEnvois limiteur) {
		this.messages = messages;
		this.limiteur = limiteur;
	}

	@PostMapping
	public ResponseEntity<Void> envoyer(@Valid @RequestBody MessageRequest requete, HttpServletRequest http) {
		// Champ piège rempli : c'est un robot. On répond comme si tout allait
		// bien, pour ne pas lui apprendre à contourner, mais on n'enregistre rien.
		if (requete.siteWeb() != null && !requete.siteWeb().isBlank()) {
			return ResponseEntity.accepted().build();
		}
		if (!limiteur.autoriser(http.getRemoteAddr())) {
			return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
		}

		messages.save(new Message(
				requete.nom().strip(),
				requete.email().strip(),
				requete.contenu().strip(),
				Instant.now()));
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}

	@GetMapping
	public List<MessageView> lister() {
		return messages.findAllByOrderByCreeLeDesc().stream().map(MessageView::de).toList();
	}

	@PatchMapping("/{id}/lu")
	public ResponseEntity<Void> marquerLu(@PathVariable long id) {
		return messages.findById(id)
				.map(message -> {
					message.marquerLu();
					messages.save(message);
					return ResponseEntity.noContent().<Void>build();
				})
				.orElse(ResponseEntity.notFound().build());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> supprimer(@PathVariable long id) {
		if (!messages.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		messages.deleteById(id);
		return ResponseEntity.noContent().build();
	}
}
