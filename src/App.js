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
  const [data, setData] = useState({
    name: "",
    periods: {}
  });

  const [analysis, setAnalysis] = useState({});
  const [forecast, setForecast] = useState({});
  const [funding, setFunding] = useState({});
  const [validation, setValidation] = useState({});
  const [confidence, setConfidence] = useState({});
  const [loading, setLoading] = useState(false);

  // 🔥 Upload
  const handleUpload = async (e) => {
    const files = e.target.files;
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    const res = await fetch(API + "/upload", {
      method: "POST",
      body: formData
    });

    const result = await res.json();

    setConfidence(result.periods || {});
    setValidation(result.validation || {});

    if (result.periods) {
      setData({
        name: "",
        periods: Object.keys(result.periods).reduce((acc, year) => {
          acc[year] = {
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
          return acc;
        }, {})
      });
    }
  };

  // 🔥 Analyze
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

  const chartData = Object.keys(data.periods).map(year => ({
    year,
    revenue: data.periods[year]?.pnl?.revenue || 0
  }));

  const card = {
    background: "#ffffff",
    padding: 20,
    borderRadius: 16,
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    marginBottom: 20
  };

  return (
    <div style={{ background: "#f5f7fb", minHeight: "100vh", padding: 20 }}>

      <h1 style={{ textAlign: "center" }}>
        🚀 Financial Intelligence Dashboard
      </h1>

      {/* Upload */}
      <motion.div style={card} whileHover={{ scale: 1.02 }}>
        <h3>📤 Upload Documents</h3>
        <input type="file" multiple onChange={handleUpload} />
      </motion.div>

      {/* Analyze Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={analyze}
        style={{
          width: "100%",
          padding: 15,
          background: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: 10,
          fontSize: 18,
          cursor: "pointer"
        }}
      >
        {loading ? "Analyzing..." : "Analyze Financials"}
      </motion.button>

      {/* Chart */}
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

      {/* Ratios */}
      <motion.div style={card}>
        <h3>📊 Ratios</h3>
        <p>Current Ratio: {analysis?.ratios?.current_ratio}</p>
        <p>Net Margin: {analysis?.ratios?.net_margin}</p>
      </motion.div>

      {/* Risk */}
      <motion.div style={card}>
        <h3>⚠️ Risk Score</h3>
        <h2>{analysis?.risk_score}</h2>
      </motion.div>

      {/* Loan */}
      <motion.div style={card}>
        <h3>🏦 Loan Eligibility</h3>
        <p>{funding?.decision}</p>
        <p>EMI: {funding?.emi}</p>
        <p>DSCR: {funding?.dscr}</p>
      </motion.div>

      {/* Validation */}
      <motion.div style={card}>
        <h3>✅ Validation</h3>
        {Object.keys(validation).map(year => (
          <div key={year}>
            <b>{year}</b>
            {validation[year].length === 0
              ? <p>✔ No issues</p>
              : validation[year].map((v, i) => <p key={i}>⚠ {v}</p>)
            }
          </div>
        ))}
      </motion.div>

      {/* Confidence */}
      <motion.div style={card}>
        <h3>🎯 Confidence</h3>
        {Object.keys(confidence).map(year => (
          <div key={year}>
            <b>{year}</b>
            <p>
              Revenue: {confidence?.[year]?.pnl?.revenue?.confidence || "N/A"}
            </p>
            <p>
              Profit: {confidence?.[year]?.pnl?.net_profit?.confidence || "N/A"}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Forecast */}
      <motion.div style={card}>
        <h3>🔮 Forecast</h3>
        <p>Revenue: {forecast?.next_revenue}</p>
        <p>Profit: {forecast?.next_profit}</p>
      </motion.div>

    </div>
  );
        }
