// src/dashboards/DriverDashboard.js
import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Profile from "../pages/Profile";

// ===================== STYLES =====================
const styles = {
  layout: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Segoe UI, sans-serif",
    background: "#f4f6f8",
  },
  sidebar: {
    width: "260px",
    background: "#0f172a",
    color: "#fff",
    padding: "20px",
  },
  logo: {
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "30px",
  },
  menuItem: (active) => ({
    padding: "12px 16px",
    marginBottom: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    background: active ? "#1e293b" : "transparent",
  }),
  main: {
    flex: 1,
    padding: "24px",
  },
  header: {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "24px",
  },
  card: {
    background: "#fff",
    padding: "18px",
    borderRadius: "14px",
    boxShadow: "0 6px 14px rgba(0,0,0,0.06)",
    marginBottom: "20px",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  button: {
    padding: "8px 14px",
    border: "none",
    borderRadius: "6px",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },
  toggle: {
    padding: "6px 14px",
    borderRadius: "20px",
    border: "none",
    fontWeight: "600",
    cursor: "pointer",
  },
  alertBox: {
    marginTop: "10px",
    padding: "10px",
    borderRadius: "6px",
    fontWeight: "600",
  },
  progressOuter: {
    height: "8px",
    background: "#e5e7eb",
    borderRadius: "10px",
    overflow: "hidden",
    marginBottom: "10px",
  },
  progressInner: (p) => ({
    width: `${p}%`,
    height: "100%",
    background: "#22c55e",
  }),
};

// ===================== COMPONENT =====================
const DriverDashboard = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [online, setOnline] = useState(true);
  const [tripStarted, setTripStarted] = useState(false);

  // Live vehicle data
  const [battery, setBattery] = useState(68);
  const [speed, setSpeed] = useState(0);
  const [alert, setAlert] = useState("");
  const [overspeedAlert, setOverspeedAlert] = useState("");

  // Trip metrics
  const [distanceCovered, setDistanceCovered] = useState(0);
  const [tripTime, setTripTime] = useState(0);
  const [tripProgress, setTripProgress] = useState(0);

  // Live map movement
  const [position, setPosition] = useState([12.9716, 77.5946]);
  const [routePath, setRoutePath] = useState([[12.9716, 77.5946]]);

  const currentTrip = {
    pickup: "MG Road, Bangalore",
    drop: "Whitefield, Bangalore",
    distance: 12, // km
    eta: "25 mins",
  };

  const earnings = {
    today: 850,
    week: 5200,
    totalTrips: 134,
  };

  const dailyTarget = {
    targetTrips: 10,
    completedTrips: 4,
  };

  const tripHistory = [
    { date: "2026-01-09", id: "TRIP1023", fare: "₹180", status: "Completed" },
    { date: "2026-01-09", id: "TRIP1024", fare: "₹220", status: "Completed" },
    { date: "2026-01-08", id: "TRIP1020", fare: "₹150", status: "Completed" },
  ];

  // ================= LIVE SIMULATION =================
  useEffect(() => {
    let interval;

    if (tripStarted) {
      interval = setInterval(() => {
        // Battery drain
        setBattery((prev) => Math.max(prev - 1, 5));

        // Speed
        const newSpeed = Math.floor(Math.random() * 40) + 20;
        setSpeed(newSpeed);

        // Trip time
        setTripTime((prev) => prev + 3);

        // Distance
        setDistanceCovered((prev) =>
          +(prev + (newSpeed / 3600) * 3).toFixed(2)
        );

        // Progress %
        setTripProgress((prev) =>
          Math.min((distanceCovered / currentTrip.distance) * 100 + 5, 100)
        );

        // Overspeed
        if (newSpeed > 55) {
          setOverspeedAlert("🚨 Overspeed Warning! Slow down.");
        } else {
          setOverspeedAlert("");
        }

        // Battery alert
        if (battery <= 20) {
          setAlert("⚠️ Battery low! Please recharge soon.");
        } else {
          setAlert("");
        }

        // Move vehicle slightly
        setPosition((prev) => {
          const newPos = [prev[0] + 0.0003, prev[1] + 0.0003];
          setRoutePath((old) => [...old, newPos]);
          return newPos;
        });
      }, 3000);
    } else {
      setSpeed(0);
    }

    return () => clearInterval(interval);
  }, [tripStarted, battery, distanceCovered]);

  const resetTripStats = () => {
    setTripStarted(false);
    setTripProgress(0);
    setTripTime(0);
    setDistanceCovered(0);
    setSpeed(0);
    setBattery(68);
    setPosition([12.9716, 77.5946]);
    setRoutePath([[12.9716, 77.5946]]);
  };

  return (
    <div style={styles.layout}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <div style={styles.logo}>🚗 Driver Panel</div>

        <div
          style={styles.menuItem(activeView === "dashboard")}
          onClick={() => setActiveView("dashboard")}
        >
          Dashboard
        </div>
        <div
          style={styles.menuItem(activeView === "earnings")}
          onClick={() => setActiveView("earnings")}
        >
          Earnings
        </div>
        <div
          style={styles.menuItem(activeView === "history")}
          onClick={() => setActiveView("history")}
        >
          Trip History
        </div>
        <div
          style={styles.menuItem(activeView === "profile")}
          onClick={() => setActiveView("profile")}
        >
          Profile
        </div>
      </aside>

      {/* MAIN */}
      <main style={styles.main}>
        <div style={styles.header}>Driver Dashboard</div>

        {activeView === "profile" && <Profile />}

        {activeView === "dashboard" && (
          <>
            {/* Online / Offline */}
            <div style={styles.card}>
              <button
                style={{
                  ...styles.toggle,
                  background: online ? "#22c55e" : "#ef4444",
                  color: "#fff",
                }}
                onClick={() => setOnline(!online)}
              >
                {online ? "Online" : "Offline"}
              </button>
              <span style={{ marginLeft: "20px", fontWeight: "600" }}>
                Earnings Today: ₹{earnings.today}
              </span>
            </div>

            {/* Current Trip */}
            <div style={styles.card}>
              <h3>Current Trip</h3>
              <p><b>Pickup:</b> {currentTrip.pickup}</p>
              <p><b>Drop:</b> {currentTrip.drop}</p>
              <p><b>Total Distance:</b> {currentTrip.distance} km</p>
              <p><b>ETA:</b> {currentTrip.eta}</p>

              <p>⏱ Time: {Math.floor(tripTime / 60)} min {tripTime % 60} sec</p>
              <p>🛣 Distance Covered: {distanceCovered} km</p>
              <p>🎯 Progress: {Math.floor(tripProgress)}%</p>

              <div style={styles.progressOuter}>
                <div style={styles.progressInner(tripProgress)} />
              </div>

              {!tripStarted ? (
                <button style={styles.button} onClick={() => setTripStarted(true)}>
                  ▶ Start Trip
                </button>
              ) : (
                <button
                  style={{ ...styles.button, background: "#16a34a" }}
                  onClick={() => {
                    alert(
                      `Trip Completed!\nDistance: ${distanceCovered} km\nTime: ${Math.floor(
                        tripTime / 60
                      )} min\nBattery Left: ${battery}%`
                    );
                    resetTripStats();
                  }}
                >
                  ✅ End Trip
                </button>
              )}

              {overspeedAlert && (
                <div
                  style={{
                    ...styles.alertBox,
                    background: "#fff7ed",
                    color: "#9a3412",
                  }}
                >
                  {overspeedAlert}
                </div>
              )}
            </div>

            {/* MAP + LIVE HEALTH */}
            <div style={styles.grid2}>
              <div style={styles.card}>
                <h3>Live Location</h3>
                <MapContainer
                  center={position}
                  zoom={13}
                  style={{ height: "260px", borderRadius: "12px" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                  {/* Route path */}
                  <Polyline
                    positions={routePath}
                    pathOptions={{ color: "blue", weight: 4 }}
                  />

                  {/* Moving marker */}
                  <Marker position={position}>
                    <Popup>
                      <b>Vehicle Status</b><br />
                      🔋 Battery: {battery}%<br />
                      🚗 Speed: {speed} km/h<br />
                      📍 Status: {tripStarted ? "In Trip" : "Idle"}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>

              <div style={styles.card}>
                <h3>Live Vehicle Health</h3>
                <p>🔋 Battery: <b>{battery}%</b></p>
                <p>🚗 Speed: <b>{speed} km/h</b></p>
                <p>
                  Health:{" "}
                  <span
                    style={{
                      color: battery <= 20 ? "#ef4444" : "#16a34a",
                      fontWeight: "700",
                    }}
                  >
                    {battery <= 20 ? "Critical" : "Healthy"}
                  </span>
                </p>

                {alert && (
                  <div
                    style={{
                      ...styles.alertBox,
                      background: "#fee2e2",
                      color: "#991b1b",
                    }}
                  >
                    {alert}
                  </div>
                )}
              </div>
            </div>

            {/* DAILY TARGET */}
            <div style={styles.card}>
              <h3>🎯 Daily Target</h3>
              <p>
                Target Trips: {dailyTarget.targetTrips} | Completed:{" "}
                {dailyTarget.completedTrips}
              </p>
              <div style={styles.progressOuter}>
                <div
                  style={styles.progressInner(
                    (dailyTarget.completedTrips / dailyTarget.targetTrips) * 100
                  )}
                />
              </div>
            </div>
          </>
        )}

        {activeView === "earnings" && (
          <div style={styles.card}>
            <h3>Earnings Summary</h3>
            <p>Today: ₹{earnings.today}</p>
            <p>This Week: ₹{earnings.week}</p>
            <p>Total Trips: {earnings.totalTrips}</p>
          </div>
        )}

        {activeView === "history" && (
          <div style={styles.card}>
            <h3>Trip History</h3>
            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Trip ID</th>
                  <th>Fare</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tripHistory.map((t, i) => (
                  <tr key={i}>
                    <td>{t.date}</td>
                    <td>{t.id}</td>
                    <td>{t.fare}</td>
                    <td>{t.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default DriverDashboard;
