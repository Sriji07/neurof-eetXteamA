//Service Layer for managing maintenance alerts
package neurofleetx.service;

import neurofleetx.model.MaintenanceAlert;
import neurofleetx.repository.MaintenanceAlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaintenanceAlertService {

    @Autowired
    private MaintenanceAlertRepository maintenanceAlertRepository;

    public List<MaintenanceAlert> getOpenAlerts() {
        return maintenanceAlertRepository.findAll(); // Add filtering logic for open alerts
    }

    public MaintenanceAlert resolveAlert(Long id) {
        MaintenanceAlert alert = maintenanceAlertRepository.findById(id).orElseThrow();
        alert.setResolved(true);
        return maintenanceAlertRepository.save(alert);
    }
}
