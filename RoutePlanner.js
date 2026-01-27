// src/pages/RoutePlanner.js
import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

/* ================= DISTANCE HELPERS ================= */
function getDistance(p1, p2) {
  const R = 6371;
  const dLat = ((p2[0] - p1[0]) * Math.PI) / 180;
  const dLng = ((p2[1] - p1[1]) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1[0] * Math.PI) / 180) *
      Math.cos((p2[0] * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function calculateTotalDistance(coords) {
  let total = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    total += getDistance(coords[i], coords[i + 1]);
  }
  return total;
}

/* ================= MAIN COMPONENT ================= */
const RoutePlanner = () => {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [vehicle, setVehicle] = useState("Car");

  const [stopInput, setStopInput] = useState("");
  const [stops, setStops] = useState([]);

  const [coords, setCoords] = useState([]);
  const [routes, setRoutes] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [finalRoute, setFinalRoute] = useState(null);
  const [message, setMessage] = useState("");

  const [routeIndex, setRouteIndex] = useState(0);
  const animationRef = useRef(null);

  /* ===== GEOCODING ===== */
  const getCoordsFromCity = async (place) => {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${place}`
    );
    const d = await r.json();
    if (!d || !d[0]) return null;
    return [parseFloat(d[0].lat), parseFloat(d[0].lon)];
  };

  const addStop = () => {
    if (stopInput.trim()) {
      setStops([...stops, stopInput.trim()]);
      setStopInput("");
    }
  };

  /* ===== GENERATE ROUTES ===== */
  const generateRoutes = async () => {
    setFinalRoute(null);
    setSelectedRoute(null);
    setMessage("");

    const src = await getCoordsFromCity(source);
    const dst = await getCoordsFromCity(destination);

    if (!src || !dst) {
      alert("Invalid source or destination");
      return;
    }

    const stopCoords = [];
    for (let s of stops) {
      const c = await getCoordsFromCity(s);
      if (c) stopCoords.push(c);
    }

    const path = [src, ...stopCoords, dst];
    setCoords(path);

    const baseDistance = calculateTotalDistance(path);

    const ratePerKm =
      vehicle === "Truck" ? 12 : vehicle === "Bike" ? 5 : 8;

    const allRoutes = [
      {
        name: "shortest",
        color: "#2563eb",
        distance: baseDistance,
        cost: baseDistance * ratePerKm,
      },
      {
        name: "traffic",
        color: "#f97316",
        distance: baseDistance * 1.1,
        cost: baseDistance * 1.2 * ratePerKm,
      },
      {
        name: "eco",
        color: "#22c55e",
        distance: baseDistance * 1.15,
        cost: baseDistance * 0.9 * ratePerKm,
      },
    ];

    setRoutes(allRoutes);

    // clear old animation
    if (animationRef.current) {
      clearInterval(animationRef.current);
    }

    // start blinking animation
    animationRef.current = setInterval(() => {
      setRouteIndex((prev) => (prev + 1) % allRoutes.length);
    }, 800);
  };

  /* ===== PLAN TRIP ===== */
  const planTrip = () => {
    if (selectedRoute === null) {
      alert("Please select a route!");
      return;
    }

    setFinalRoute(selectedRoute);
    clearInterval(animationRef.current);
    setMessage("🚚 Trip Assigned to Driver: Ravi Kumar");
  };

  return (
    <div style={styles.container}>
      {/* ================= SIDEBAR ================= */}
      <div style={styles.sidebar}>
        <h2 style={styles.title}>Route Planner</h2>

        <label style={styles.label}>Source</label>
        <input
          style={styles.input}
          placeholder="Enter source city"
          onChange={(e) => setSource(e.target.value)}
        />

        <label style={styles.label}>Destination</label>
        <input
          style={styles.input}
          placeholder="Enter destination city"
          onChange={(e) => setDestination(e.target.value)}
        />

        <label style={styles.label}>Stop (Optional)</label>
        <input
          style={styles.input}
          value={stopInput}
          onChange={(e) => setStopInput(e.target.value)}
        />
        <button style={styles.secondaryBtn} onClick={addStop}>
          Add Stop
        </button>

        {stops.map((s, i) => (
          <div key={i} style={styles.stop}>🚏 {s}</div>
        ))}

        <label style={styles.label}>Vehicle</label>
        <select
          style={styles.input}
          onChange={(e) => setVehicle(e.target.value)}
        >
          <option>Car</option>
          <option>Bike</option>
          <option>Truck</option>
        </select>

        <button style={styles.primaryBtn} onClick={generateRoutes}>
          Generate Routes
        </button>

        {/* ================= ROUTE CARDS ================= */}
        {routes && (
          <div style={styles.cards}>
            {routes.map((r, index) => (
              <div
                key={index}
                style={{
                  ...styles.card,
                  border:
                    selectedRoute === index
                      ? "2px solid #2563eb"
                      : "1px solid #d1d5db",
                }}
              >
                <input
                  type="radio"
                  name="route"
                  onChange={() => setSelectedRoute(index)}
                />

                <h4 style={styles.cardTitle}>
                  {r.name === "shortest" && "🔵 Shortest Route"}
                  {r.name === "traffic" && "🟠 Traffic Aware Route"}
                  {r.name === "eco" && "🟢 Eco Friendly Route"}
                </h4>

                <p>Distance: {r.distance.toFixed(2)} km</p>
                <p>Cost: ₹{Math.round(r.cost)}</p>
              </div>
            ))}

            <button style={styles.planBtn} onClick={planTrip}>
              Plan Trip
            </button>
          </div>
        )}

        {message && <div style={styles.success}>{message}</div>}
      </div>

      {/* ================= MAP ================= */}
      <div style={styles.mapBox}>
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Show all 3 routes blinking */}
          {routes && !finalRoute &&
            routes.map((r, i) => (
              <Polyline
                key={i}
                positions={coords}
                pathOptions={{
                  color: r.color,
                  weight: 4,
                  opacity: routeIndex === i ? 1 : 0.3,
                }}
              />
            ))}

          {/* Show only selected route after planning */}
          {finalRoute !== null && (
            <Polyline
              positions={coords}
              pathOptions={{
                color: routes[finalRoute].color,
                weight: 6,
                opacity: 1,
              }}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default RoutePlanner;

/* ================= STYLES ================= */
const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: "380px 1fr",
    height: "100vh",
    background: "#f3f4f6",
    fontFamily: "Segoe UI, sans-serif",
    color: "#111827",
  },

  sidebar: {
    padding: 20,
    background: "#ffffff",
    borderRight: "2px solid #e5e7eb",
    overflowY: "auto",
  },

  title: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 15,
  },

  label: {
    fontWeight: 600,
    marginTop: 10,
  },

  input: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "1px solid #9ca3af",
    marginBottom: 6,
  },

  primaryBtn: {
    width: "100%",
    padding: 12,
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontWeight: 600,
    marginTop: 10,
  },

  secondaryBtn: {
    width: "100%",
    padding: 10,
    background: "#e0e7ff",
    border: "none",
    borderRadius: 10,
    fontWeight: 600,
  },

  stop: {
    fontSize: 13,
    marginTop: 4,
  },

  cards: {
    marginTop: 15,
  },

  card: {
    background: "#f9fafb",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },

  cardTitle: {
    margin: "6px 0",
  },

  planBtn: {
    width: "100%",
    padding: 12,
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontWeight: 700,
  },

  success: {
    marginTop: 14,
    padding: 12,
    background: "#dcfce7",
    color: "#065f46",
    borderRadius: 10,
    fontWeight: 600,
  },

  mapBox: {
    height: "100%",
    background: "#e5e7eb",
  },
};
