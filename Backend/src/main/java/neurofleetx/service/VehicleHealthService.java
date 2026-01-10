//Service layer to simulate vehicle health parameters
package neurofleetx.service;

import neurofleetx.model.VehicleHealth;
import neurofleetx.repository.VehicleHealthRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class VehicleHealthService {

    @Autowired
    private VehicleHealthRepository vehicleHealthRepository;

    public VehicleHealth simulateHealth(Long vehicleId) {
        Random random = new Random();
        VehicleHealth health = new VehicleHealth();
        health.setVehicleId(vehicleId);
        health.setEngineHealth(random.nextInt(101));
        health.setTireHealth(random.nextInt(101));
        health.setBatteryHealth(random.nextInt(101));
        health.setFuelLevel(random.nextInt(101));
        health.setMileage(random.nextInt(100000));
        health.setTimestamp(LocalDateTime.now());
        return vehicleHealthRepository.save(health);
    }
}
