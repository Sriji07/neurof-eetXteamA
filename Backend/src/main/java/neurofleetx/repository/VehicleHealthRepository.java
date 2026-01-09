//Performs CRUD operations on VehicleHealth
package neurofleetx.repository;

import neurofleetx.model.VehicleHealth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VehicleHealthRepository extends JpaRepository<VehicleHealth, Long> {
}
