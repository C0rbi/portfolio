package nc.allan.portfolio.message;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

	/** Boîte de réception : les messages les plus récents d'abord. */
	List<Message> findAllByOrderByCreeLeDesc();

	long countByLuFalse();
}
