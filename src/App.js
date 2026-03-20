import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { motion } from "framer-motion";

const API = "https://your-backend.onrender.com";

export default function App() {
  const [data, setData] = useState({ name: "", periods: {} });
  const [validation, setValidation] = useState({});
  const [confidence, setConfidence] = useState({});
  const [analysis, setAnalysis] = useState({});
  const [forecast, setForecast] = useState({});
  const [funding, setFunding] = useState({});
  const [loading, setLoading] = useState(false);

  const [currentFile, setCurrentFile] = useState(null);
  const [previousFile, setPreviousFile] = useState(null);

  // =====================
  // 🔥 UPLOAD + AUTO FILL
  // =====================
  const handleUpload = async () => {
    const formData = new FormData();

    if (previousFile) {
      formData.append("files", previousFile);
      formData.append("years", "2024");
    }

    if (currentFile) {
      formData.append("files", currentFile);
      formData.append("years", "2025");
    }

    const res = await fetch(API + "/upload", {
      method: "POST",
      body: formData
    });

    const result = await res.json();

    if (result.periods) {
      const formatted = {};

      Object.keys(result.periods).forEach(year => {
        formatted[year] = {
          balance_sheet: {
            current_assets:
              result.periods[year]?.balance_sheet?.current_assets?.value || 0,
            current_liabilities:
              result.periods[year]?.balance_sheet?.current_liabilities?.value || 0
          },
          pnl: {
            revenue:
              result.periods[year]?.pnl?.revenue?.value || 0,
            net_profit:
              result.periods[year]?.pnl?.net_profit?.value || 0
          }
        };
      });

      setData({ name: "", periods: formatted });
      setValidation(result.validation || {});
      setConfidence(result.periods || {});
    }
  };

  // =====================
  // 🔥 ANALYSIS
  // =====================
  const analyze = async () => {
    setLoading(true);

    const i = await fetch(API + "/insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(r => r.json());

    const f = await fetch(API + "/forecast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(r => r.json());

    const fu = await fetch(API + "/funding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(r => r.json());

    setAnalysis(i);
    setForecast(f);
    setFunding(fu);

    setLoading(false);
  };

  // =====================
  // 🔥 EDIT HANDLER
  // =====================
  const update = (year, section, field, value) => {
    setData(prev => ({
      ...prev,
      periods: {
        ...prev.periods,
        [year]: {
          ...prev.periods[year],
          [section]: {
            ...prev.periods[year][section],
            [field]: Number(value)
          }
        }
      }
    }));
  };

  const chartData = Object.keys(data.periods).map(year => ({
    year,
    revenue: data.periods[year]?.pnl?.revenue || 0
  }));

  const card = {
    background: "#ffffff",
    padding: 20,
    borderRadius: 16,
    boxShadow: "0 6px 25px rgba(0,0,0,0.08)",
    marginBottom: 20
  };

  // =====================
  // UI
  // =====================
  return (
    <div style={{ background: "#f4f6fb", minHeight: "100vh", padding: 20 }}>
      <h1 style={{ textAlign: "center" }}>
        🚀 Financial Intelligence Dashboard
      </h1>

      {/* UPLOAD */}
      <motion.div style={card} whileHover={{ scale: 1.02 }}>
        <h3>📤 Upload Documents</h3>

        <p>Previous Year</p>
        <input type="file" onChange={e => setPreviousFile(e.target.files[0])} />

        <p>Current Year</p>
        <input type="file" onChange={e => setCurrentFile(e.target.files[0])} />

        <button onClick={handleUpload}>Upload & Parse</button>
      </motion.div>

      {/* DATA EDIT */}
      {Object.keys(data.periods).map(year => (
        <motion.div key={year} style={card}>
          <h3>{year}</h3>

          <input
            placeholder="Assets"
            value={data.periods[year].balance_sheet.current_assets}
            onChange={e =>
              update(year, "balance_sheet", "current_assets", e.target.value)
            }
          />

          <input
            placeholder="Liabilities"
            value={data.periods[year].balance_sheet.current_liabilities}
            onChange={e =>
              update(year, "balance_sheet", "current_liabilities", e.target.value)
            }
          />

          <input
            placeholder="Revenue"
            value={data.periods[year].pnl.revenue}
            onChange={e =>
              update(year, "pnl", "revenue", e.target.value)
            }
          />

          <input
            placeholder="Profit"
            value={data.periods[year].pnl.net_profit}
            onChange={e =>
              update(year, "pnl", "net_profit", e.target.value)
            }
          />
        </motion.div>
      ))}

      {/* ANALYZE */}
      <button
        onClick={analyze}
        style={{
          width: "100%",
          padding: 15,
          background: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: 10,
          fontSize: 18
        }}
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {/* CHART */}
      <motion.div style={card}>
        <h3>📈 Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Line dataKey="revenue" stroke="#4CAF50" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* RATIOS */}
      <motion.div style={card}>
        <h3>📊 Ratios</h3>
        <p>Current Ratio: {analysis?.ratios?.current_ratio}</p>
        <p>Net Margin: {analysis?.ratios?.net_margin}</p>
      </motion.div>

      {/* RISK */}
      <motion.div style={card}>
        <h3>⚠️ Risk Score</h3>
        <h2>{analysis?.risk_score}</h2>
      </motion.div>

      {/* FUNDING */}
      <motion.div style={card}>
        <h3>🏦 Loan Eligibility</h3>
        <p>{funding?.decision}</p>
        <p>EMI: {funding?.emi}</p>
        <p>DSCR: {funding?.dscr}</p>
      </motion.div>

      {/* VALIDATION */}
      <motion.div style={card}>
        <h3>Validation</h3>
        {Object.keys(validation).map(year => (
          <div key={year}>
            <b>{year}</b>
            {validation[year].length === 0
              ? <p>✔ OK</p>
              : validation[year].map((v, i) => <p key={i}>⚠ {v}</p>)
            }
          </div>
        ))}
      </motion.div>

      {/* CONFIDENCE */}
      <motion.div style={card}>
        <h3>Confidence</h3>
        {Object.keys(confidence).map(year => (
          <div key={year}>
            <b>{year}</b>
            <p>Revenue: {confidence?.[year]?.pnl?.revenue?.confidence || "N/A"}</p>
            <p>Profit: {confidence?.[year]?.pnl?.net_profit?.confidence || "N/A"}</p>
          </div>
        ))}
      </motion.div>

      {/* FORECAST */}
      <motion.div style={card}>
        <h3>Forecast</h3>
        <p>Revenue: {forecast?.next_revenue}</p>
        <p>Profit: {forecast?.next_profit}</p>
      </motion.div>
    </div>
  );
        }
