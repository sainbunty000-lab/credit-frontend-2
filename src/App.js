import { useState } from "react";
import { motion } from "framer-motion";

const API = "https://your-backend.onrender.com";

export default function App() {
  const [data, setData] = useState({
    name: "",
    periods: {}
  });

  const [validation, setValidation] = useState({});
  const [confidence, setConfidence] = useState({});
  const [currentFile, setCurrentFile] = useState(null);
  const [previousFile, setPreviousFile] = useState(null);

  // 🔥 AUTO UPDATE LOGIC
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

    // 🔥 AUTO UPDATE STATE
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

      setData({
        name: "",
        periods: formatted
      });

      setValidation(result.validation || {});
      setConfidence(result.periods || {});
    }
  };

  const card = {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20
  };

  return (
    <div style={{ padding: 20, background: "#f5f7fb", minHeight: "100vh" }}>
      <h1>Financial Dashboard</h1>

      {/* Upload */}
      <motion.div style={card}>
        <h3>Upload Files</h3>

        <p>Previous Year</p>
        <input type="file" onChange={e => setPreviousFile(e.target.files[0])} />

        <p>Current Year</p>
        <input type="file" onChange={e => setCurrentFile(e.target.files[0])} />

        <button onClick={handleUpload}>Upload & Parse</button>
      </motion.div>

      {/* AUTO FILLED DATA */}
      <div style={card}>
        <h3>Auto Filled Data</h3>

        {Object.keys(data.periods).map(year => (
          <div key={year}>
            <h4>{year}</h4>

            <p>Revenue: {data.periods[year].pnl.revenue}</p>
            <p>Profit: {data.periods[year].pnl.net_profit}</p>
            <p>Assets: {data.periods[year].balance_sheet.current_assets}</p>
            <p>Liabilities: {data.periods[year].balance_sheet.current_liabilities}</p>
          </div>
        ))}
      </div>

      {/* VALIDATION */}
      <div style={card}>
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
      </div>

      {/* CONFIDENCE */}
      <div style={card}>
        <h3>Confidence</h3>

        {Object.keys(confidence).map(year => (
          <div key={year}>
            <b>{year}</b>

            <p>
              Revenue:
              {confidence?.[year]?.pnl?.revenue?.confidence || "N/A"}
            </p>

            <p>
              Profit:
              {confidence?.[year]?.pnl?.net_profit?.confidence || "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
        }
