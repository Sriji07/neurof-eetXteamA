//REST controller handling vehicle health-related APIs
package neurofleetx.controller;

import neurofleetx.model.VehicleHealth;
import neurofleetx.service.VehicleHealthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/maintenance/health")
public class VehicleHealthController {

    @Autowired
    private VehicleHealthService vehicleHealthService;

    @PostMapping("/simulate/{vehicleId}")
    public VehicleHealth simulateHealth(@PathVariable Long vehicleId) {
        return vehicleHealthService.simulateHealth(vehicleId);
    }
}
