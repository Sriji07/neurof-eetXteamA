//Represents the health parameters of the vehicles and stores simulated health data for vehicles
package neurofleetx.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class VehicleHealth {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long vehicleId;
    private int engineHealth;
    private int tireHealth;
    private int batteryHealth;
    private int fuelLevel;
    private int mileage;
    private LocalDateTime timestamp;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public int getEngineHealth() {
        return engineHealth;
    }

    public void setEngineHealth(int engineHealth) {
        this.engineHealth = engineHealth;
    }

    public int getTireHealth() {
        return tireHealth;
    }

    public void setTireHealth(int tireHealth) {
        this.tireHealth = tireHealth;
    }

    public int getBatteryHealth() {
        return batteryHealth;
    }

    public void setBatteryHealth(int batteryHealth) {
        this.batteryHealth = batteryHealth;
    }

    public int getFuelLevel() {
        return fuelLevel;
    }

    public void setFuelLevel(int fuelLevel) {
        this.fuelLevel = fuelLevel;
    }

    public int getMileage() {
        return mileage;
    }

    public void setMileage(int mileage) {
        this.mileage = mileage;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
