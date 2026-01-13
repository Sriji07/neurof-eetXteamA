import React, { useState } from "react";

const MaintenanceDashboard = () => {
  const [engine, setEngine] = useState(82);
  const [battery, setBattery] = useState(76);
  const [tire, setTire] = useState(68);

  const [monitoringOn, setMonitoringOn] = useState(true);
  const [predictionOn, setPredictionOn] = useState(true);
  const [alertsOn, setAlertsOn] = useState(true);

  const alerts = [];
  if (alertsOn) {
    if (engine < 70)
      alerts.push({ id: "VH-102", issue: "Low Engine Health", action: "Schedule Service" });
    if (battery < 70)
      alerts.push({ id: "VH-221", issue: "Battery Degradation", action: "Replace Battery" });
    if (tire < 70)
      alerts.push({ id: "VH-309", issue: "Tire Wear High", action: "Inspect Tires" });
  }

  return (
    <>
      <style>{`
        .maintenance-container {
          padding: 20px;
          color: #0f172a;
        }

        .service-grid,
        .kpi-grid,
        .health-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .card {
          background: #ffffff;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 6px 15px rgba(0,0,0,0.08);
        }

        .card h4 {
          margin-bottom: 10px;
        }

        .card button {
          padding: 6px 14px;
          border: none;
          border-radius: 6px;
          background: #2563eb;
          color: white;
          cursor: pointer;
        }

        .kpi-value {
          font-size: 26px;
          font-weight: bold;
        }

        .green { border-left: 5px solid #22c55e; }
        .red { border-left: 5px solid #ef4444; }
        .blue { border-left: 5px solid #3b82f6; }

        input[type="range"] {
          width: 100%;
        }

        .chart {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 40px;
          height: 220px;
          margin-top: 20px;
        }

        .bar {
          width: 40px;
          background: #22c55e;
          border-radius: 6px 6px 0 0;
        }

        .alert-item {
          background: #fff;
          padding: 12px;
          border-left: 4px solid #ef4444;
          border-radius: 6px;
          margin-bottom: 10px;
        }

        .healthy {
          color: #22c55e;
          font-weight: bold;
        }
      `}</style>

      <div className="maintenance-container">
        <h1 className="fd-page-title">🔧 Predictive Maintenance</h1>

        {/* SERVICES */}
        <div className="service-grid">
          <div className="card">
            <h4>🛠 Health Monitoring</h4>
            <button onClick={() => setMonitoringOn(!monitoringOn)}>
              {monitoringOn ? "Disable" : "Enable"}
            </button>
          </div>

          <div className="card">
            <h4>📈 Maintenance Prediction</h4>
            <button onClick={() => setPredictionOn(!predictionOn)}>
              {predictionOn ? "Disable" : "Enable"}
            </button>
          </div>

          <div className="card">
            <h4>🚨 Alert System</h4>
            <button onClick={() => setAlertsOn(!alertsOn)}>
              {alertsOn ? "Disable" : "Enable"}
            </button>
          </div>
        </div>

        {/* KPI */}
        <div className="kpi-grid">
          <div className="card green">
            <h4>Avg Engine Health</h4>
            <div className="kpi-value">{engine}%</div>
          </div>

          <div className="card green">
            <h4>Battery Status</h4>
            <div className="kpi-value">{battery >= 70 ? "Healthy" : "Warning"}</div>
          </div>

          <div className="card red">
            <h4>Critical Alerts</h4>
            <div className="kpi-value">{alerts.length}</div>
          </div>

          <div className="card blue">
            <h4>Next Service</h4>
            <div className="kpi-value">
              {engine < 70 || tire < 70 ? "Immediate" : "7 Days"}
            </div>
          </div>
        </div>

        {/* HEALTH */}
        {monitoringOn && (
          <div className="health-grid">
            {[engine, battery, tire].map((v, i) => (
              <div className="card" key={i}>
                <h4>{["Engine", "Battery", "Tire"][i]} Health</h4>
                <p>{v}%</p>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={v}
                  onChange={(e) =>
                    i === 0
                      ? setEngine(+e.target.value)
                      : i === 1
                      ? setBattery(+e.target.value)
                      : setTire(+e.target.value)
                  }
                />
              </div>
            ))}
          </div>
        )}

        {/* ANALYTICS */}
        {predictionOn && (
          <div className="card">
            <h3>Health Analytics</h3>
            <div className="chart">
              {[engine, battery, tire].map((v, i) => (
                <div key={i}>
                  <div className="bar" style={{ height: `${v * 2}px` }} />
                  <p style={{ textAlign: "center" }}>
                    {["Engine", "Battery", "Tire"][i]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ALERTS */}
        {alertsOn && (
          <div className="card">
            <h3>Maintenance Alerts</h3>
            {alerts.length === 0 ? (
              <p className="healthy">All systems operating normally</p>
            ) : (
              alerts.map((a, i) => (
                <div className="alert-item" key={i}>
                  <strong>{a.id}</strong> – {a.issue} → {a.action}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default MaintenanceDashboard;
