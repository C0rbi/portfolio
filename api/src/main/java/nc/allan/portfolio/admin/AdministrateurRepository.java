package nc.allan.portfolio.admin;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdministrateurRepository extends JpaRepository<Administrateur, Long> {

	Optional<Administrateur> findByIdentifiant(String identifiant);
}
