//Performs CRUD operations on MaintenanceAlert
package neurofleetx.repository;

import neurofleetx.model.MaintenanceAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaintenanceAlertRepository extends JpaRepository<MaintenanceAlert, Long> {
}
