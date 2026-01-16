import React, { useState } from "react";
import { MapContainer, TileLayer, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import Profile from "../pages/Profile";
import FleetManagerDashboard from "./FleetManagerDashboard";
import CustomerDashboard from "./CustomerDashboard";
import DriverDashboard from "./DriverDashboard";

// ===================== STYLES =====================
const styles = {
  layout: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Segoe UI, sans-serif",
    background: "#f4f6f8",
  },
  aside: {
    width: "260px",
    background: "#0f172a",
    color: "#fff",
    padding: "20px",
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
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#0f172a",
    color: "#fff",
    padding: "14px 20px",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  dropdown: {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "none",
    fontWeight: "600",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 6px 14px rgba(0,0,0,0.06)",
    marginBottom: "24px",
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
  },
  kpiCard: {
    background: "#fff",
    padding: "18px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
  },
  button: {
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    marginRight: "10px",
    fontWeight: "600",
  },
};

// ===================== COMPONENT =====================
const AdminDashboard = () => {
  // Dropdown dashboards
  const [dashboardView, setDashboardView] = useState("admin");

  // Aside features
  const [activeFeature, setActiveFeature] = useState("kpi");

  // Reports filter states
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // KPI DATA
  const kpis = {
    "Total Fleet": 120,
    "Active Vehicles": 87,
    "Trips Today": 342,
    "Active Routes": 26,
    "EV Utilization %": 68,
  };

  // Heatmap Data
  const heatmapData = [
    { lat: 12.9721, lng: 77.5933, trips: 7 },
    { lat: 12.9756, lng: 77.5999, trips: 12 },
    { lat: 12.9652, lng: 77.5854, trips: 5 },
  ];

  // Hourly Chart Data
  const chartData = {
    labels: ["1AM", "3AM", "5AM", "7AM", "9AM", "11AM", "1PM", "3PM", "5PM"],
    datasets: [
      {
        label: "Trips",
        data: [2, 4, 8, 12, 9, 7, 5, 3, 1],
        backgroundColor: "#2563eb",
      },
    ],
  };

  // Fleet Status Pie
  const fleetStatusData = {
    labels: ["Active", "Idle", "Maintenance", "Offline"],
    datasets: [
      {
        data: [65, 20, 10, 5],
        backgroundColor: ["#22c55e", "#facc15", "#fb923c", "#ef4444"],
      },
    ],
  };

  // Reports Data
  const monthlySummary = {
    totalTrips: 10234,
    totalRevenue: "₹ 4,52,000",
    profit: "₹ 1,85,000",
    activeVehicles: 96,
  };

  const companyReports = [
    { date: "2026-01-05", trips: 310, revenue: "₹42,000", vehicles: 84, profit: "₹11,500" },
    { date: "2026-01-06", trips: 335, revenue: "₹46,800", vehicles: 86, profit: "₹13,200" },
    { date: "2026-01-07", trips: 360, revenue: "₹51,000", vehicles: 88, profit: "₹15,000" },
    { date: "2026-01-08", trips: 390, revenue: "₹56,500", vehicles: 90, profit: "₹17,500" },
  ];

  // Filter logic
  const filteredReports = companyReports.filter((r) => {
    if (!fromDate && !toDate) return true;

    const reportDate = new Date(r.date);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    if (from && reportDate < from) return false;
    if (to && reportDate > to) return false;
    return true;
  });

  // CSV Export
  const exportCSV = () => {
    const headers = "Metric,Value\n";
    const rows = Object.entries(kpis)
      .map(([k, v]) => `${k},${v}`)
      .join("\n");

    const blob = new Blob([headers + rows], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "admin_dashboard_kpis.csv";
    link.click();
  };

  // PDF Export (NO doc.autoTable here)
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("NeuroFleetX - Admin Dashboard Report", 14, 15);

    autoTable(doc, {
      startY: 25,
      head: [["Metric", "Value"]],
      body: Object.entries(kpis),
    });

    const nextY = doc.lastAutoTable.finalY + 10;
    doc.text("Heatmap Data", 14, nextY);

    autoTable(doc, {
      startY: nextY + 5,
      head: [["Latitude", "Longitude", "Trips"]],
      body: heatmapData.map((h) => [h.lat, h.lng, h.trips]),
    });

    doc.save("admin_dashboard_report.pdf");
  };
  const getHeatColor = (trips) => {
  if (trips >= 12) return "#dc2626";   // 🔴 High demand
  if (trips >= 7) return "#f97316";    // 🟠 Medium demand
  return "#22c55e";                    // 🟢 Low demand
};


  return (
    <div style={styles.layout}>
      {/* ASIDE */}
      <aside style={styles.aside}>
        <h3>👑 Admin Features</h3>

        <div style={styles.menuItem(activeFeature === "kpi")} onClick={() => setActiveFeature("kpi")}>
          📊 KPI Cards
        </div>

        <div style={styles.menuItem(activeFeature === "heatmap")} onClick={() => setActiveFeature("heatmap")}>
          🔥 Heat Map
        </div>

        <div style={styles.menuItem(activeFeature === "chart")} onClick={() => setActiveFeature("chart")}>
          ⏰ Hourly Rental Chart
        </div>

        <div style={styles.menuItem(activeFeature === "fleetStatus")} onClick={() => setActiveFeature("fleetStatus")}>
          🟢 Fleet Status Pie
        </div>

        <div style={styles.menuItem(activeFeature === "reports")} onClick={() => setActiveFeature("reports")}>
          📄 Reports
        </div>

        <div style={styles.menuItem(activeFeature === "profile")} onClick={() => setActiveFeature("profile")}>
          👤 Profile
        </div>
      </aside>

      {/* MAIN */}
      <main style={styles.main}>
        {/* TOP BAR */}
        <div style={styles.topBar}>
          <h2>Admin Control Panel</h2>
          <select
            value={dashboardView}
            onChange={(e) => setDashboardView(e.target.value)}
            style={styles.dropdown}
          >
            <option value="admin">Admin Dashboard</option>
            <option value="fleet">Fleet Manager Dashboard</option>
            <option value="customer">Customer Dashboard</option>
            <option value="driver">Driver Dashboard</option>
          </select>
        </div>

        {/* OTHER DASHBOARDS */}
        {dashboardView === "fleet" && <FleetManagerDashboard />}
        {dashboardView === "customer" && <CustomerDashboard />}
        {dashboardView === "driver" && <DriverDashboard />}

        {/* ADMIN DASHBOARD */}
        {dashboardView === "admin" && (
          <>
            {activeFeature === "kpi" && (
              <div style={styles.card}>
                <h2>KPI Cards</h2>
                <div style={styles.kpiGrid}>
                  {Object.entries(kpis).map(([k, v]) => (
                    <div key={k} style={styles.kpiCard}>
                      <h4>{k}</h4>
                      <p style={{ fontSize: "24px", fontWeight: "700" }}>{v}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {activeFeature === "heatmap" && (
  <div style={styles.card}>
    <h2>Fleet Heat Map</h2>
    <MapContainer
      center={[12.9716, 77.5946]}
      zoom={12}
      style={{ height: "380px", borderRadius: "12px" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {heatmapData.map((p, i) => {
        const color = getHeatColor(p.trips);

        return (
          <Circle
            key={i}
            center={[p.lat, p.lng]}
            radius={p.trips * 200}
            pathOptions={{
              color: color,
              fillColor: color,
              fillOpacity: 0.5,
            }}
          />
        );
      })}
    </MapContainer>

    {/* Legend */}
    <div style={{ marginTop: "10px", display: "flex", gap: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ width: "12px", height: "12px", background: "#22c55e", borderRadius: "50%" }}></span>
        Low Demand
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ width: "12px", height: "12px", background: "#f97316", borderRadius: "50%" }}></span>
        Medium Demand
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ width: "12px", height: "12px", background: "#dc2626", borderRadius: "50%" }}></span>
        High Demand
      </div>
    </div>
  </div>
)}


            {activeFeature === "chart" && (
              <div style={styles.card}>
                <h2>Hourly Rental Activity</h2>
                <Bar data={chartData} />
              </div>
            )}

            {activeFeature === "fleetStatus" && (
              <div style={styles.card}>
                <h2>Fleet Status Distribution</h2>
                <Pie data={fleetStatusData} />
              </div>
            )}

           {activeFeature === "reports" && (
  <div style={styles.card}>
    <h2>Reports & Analytics</h2>

    {/* ================= FILTERS ================= */}
    <div
      style={{
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
        marginBottom: "20px",
        alignItems: "center",
      }}
    >
      <div>
        <label>From:</label><br />
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          style={{ padding: "6px" }}
        />
      </div>

      <div>
        <label>To:</label><br />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          style={{ padding: "6px" }}
        />
      </div>

      <div>
        <label>Report Type:</label><br />
        <select style={{ padding: "6px" }}>
          <option>Trips Report</option>
          <option>Revenue Report</option>
          <option>Fleet Performance</option>
          <option>Driver Performance</option>
        </select>
      </div>
    </div>

    {/* ================= MONTHLY SUMMARY ================= */}
    <h3>Monthly Summary</h3>
    <div style={styles.kpiGrid}>
      <div style={styles.kpiCard}>
        <h4>Total Trips</h4>
        <p>{monthlySummary.totalTrips}</p>
      </div>
      <div style={styles.kpiCard}>
        <h4>Total Revenue</h4>
        <p>{monthlySummary.totalRevenue}</p>
      </div>
      <div style={styles.kpiCard}>
        <h4>Profit</h4>
        <p>{monthlySummary.profit}</p>
      </div>
      <div style={styles.kpiCard}>
        <h4>Active Vehicles</h4>
        <p>{monthlySummary.activeVehicles}</p>
      </div>
    </div>

    {/* ================= COMPANY TABLE ================= */}
    <h3 style={{ marginTop: "25px" }}>Company Performance Report</h3>
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "10px",
        fontSize: "14px",
      }}
    >
      <thead>
        <tr style={{ background: "#1e293b", color: "#fff" }}>
          <th style={{ padding: "8px" }}>Date</th>
          <th style={{ padding: "8px" }}>Trips</th>
          <th style={{ padding: "8px" }}>Revenue</th>
          <th style={{ padding: "8px" }}>Active Vehicles</th>
          <th style={{ padding: "8px" }}>Profit</th>
        </tr>
      </thead>
      <tbody>
        {filteredReports.map((r, i) => (
          <tr key={i} style={{ background: i % 2 === 0 ? "#f9fafb" : "#fff" }}>
            <td style={{ padding: "8px" }}>{r.date}</td>
            <td style={{ padding: "8px" }}>{r.trips}</td>
            <td style={{ padding: "8px" }}>{r.revenue}</td>
            <td style={{ padding: "8px" }}>{r.vehicles}</td>
            <td style={{ padding: "8px" }}>{r.profit}</td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* ================= DOWNLOAD BUTTONS (END) ================= */}
    <div
      style={{
        marginTop: "25px",
        paddingTop: "15px",
        borderTop: "2px solid #e5e7eb",
        textAlign: "right",
      }}
    >
      <button style={styles.button} onClick={exportCSV}>
        Download CSV
      </button>
      <button style={styles.button} onClick={exportPDF}>
        Download PDF
      </button>
    </div>
  </div>
)}


            {activeFeature === "profile" && <Profile />}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
