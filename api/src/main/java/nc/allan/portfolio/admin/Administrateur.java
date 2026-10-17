package nc.allan.portfolio.admin;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

/** Compte de la page /admin (table « administrateur », voir schema.sql). */
@Entity
@Table(name = "administrateur")
public class Administrateur {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true, length = 50)
	private String identifiant;

	/** Empreinte BCrypt du mot de passe (60 caractères), jamais le mot de passe lui-même. */
	@Column(name = "mot_de_passe", nullable = false, length = 60)
	private String motDePasse;

	@Column(name = "cree_le", nullable = false)
	private Instant creeLe;

	/** Réservé à JPA. */
	protected Administrateur() {
	}

	public Administrateur(String identifiant, String motDePasse, Instant creeLe) {
		this.identifiant = identifiant;
		this.motDePasse = motDePasse;
		this.creeLe = creeLe;
	}

	public void changerMotDePasse(String empreinte) {
		this.motDePasse = empreinte;
	}

	public Long getId() {
		return id;
	}

	public String getIdentifiant() {
		return identifiant;
	}

	public String getMotDePasse() {
		return motDePasse;
	}

	public Instant getCreeLe() {
		return creeLe;
	}
}
