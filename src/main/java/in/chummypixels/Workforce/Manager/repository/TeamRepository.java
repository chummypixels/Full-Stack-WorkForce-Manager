package in.chummypixels.Workforce.Manager.repository;

import in.chummypixels.Workforce.Manager.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
}
