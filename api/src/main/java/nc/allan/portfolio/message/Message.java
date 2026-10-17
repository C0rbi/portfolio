package nc.allan.portfolio.message;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

/** Un message reçu par le formulaire de contact (table « message », voir schema.sql). */
@Entity
@Table(name = "message")
public class Message {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 100)
	private String nom;

	@Column(nullable = false, length = 254)
	private String email;

	@Column(nullable = false, length = 5000)
	private String contenu;

	@Column(name = "cree_le", nullable = false)
	private Instant creeLe;

	@Column(nullable = false)
	private boolean lu;

	/** Réservé à JPA. */
	protected Message() {
	}

	public Message(String nom, String email, String contenu, Instant creeLe) {
		this.nom = nom;
		this.email = email;
		this.contenu = contenu;
		this.creeLe = creeLe;
		this.lu = false;
	}

	public void marquerLu() {
		this.lu = true;
	}

	public Long getId() {
		return id;
	}

	public String getNom() {
		return nom;
	}

	public String getEmail() {
		return email;
	}

	public String getContenu() {
		return contenu;
	}

	public Instant getCreeLe() {
		return creeLe;
	}

	public boolean isLu() {
		return lu;
	}
}
