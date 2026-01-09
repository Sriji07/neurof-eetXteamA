//REST controller for managing maintenance alerts
package neurofleetx.controller;

import neurofleetx.model.MaintenanceAlert;
import neurofleetx.service.MaintenanceAlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance/alerts")
public class MaintenanceAlertController {

    @Autowired
    private MaintenanceAlertService maintenanceAlertService;

    @GetMapping("/open/all")
    public List<MaintenanceAlert> getOpenAlerts() {
        return maintenanceAlertService.getOpenAlerts();
    }

    @PutMapping("/{id}/resolve")
    public MaintenanceAlert resolveAlert(@PathVariable Long id) {
        return maintenanceAlertService.resolveAlert(id);
    }
}
