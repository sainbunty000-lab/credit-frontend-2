import { useState, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const API = "https://credit-backend-production-d988.up.railway.app";

export default function App() {
  const reportRef = useRef();

  const [data, setData] = useState({ name: "", periods: {} });
  const [validation, setValidation] = useState({});
  const [confidence, setConfidence] = useState({});
  const [analysis, setAnalysis] = useState({});
  const [forecast, setForecast] = useState({});
  const [funding, setFunding] = useState({});
  const [loading, setLoading] = useState(false);

  const [currentFiles, setCurrentFiles] = useState([]);
  const [previousFiles, setPreviousFiles] = useState([]);

  // =====================
  // 🔥 UPLOAD
  // =====================
  const handleUpload = async () => {
    if (!currentFiles.length && !previousFiles.length) {
      alert("Upload at least one file");
      return;
    }

    const formData = new FormData();

    for (let f of previousFiles) {
      formData.append("files", f);
      formData.append("years", "2024");
    }

    for (let f of currentFiles) {
      formData.append("files", f);
      formData.append("years", "2025");
    }

    const res = await fetch(API + "/upload", {
      method: "POST",
      body: formData
    });

    const result = await res.json();

    if (!result.periods) {
      alert("Parsing failed");
      return;
    }

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
  };

  // =====================
  // 🔥 ANALYZE
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
  // 🔥 PDF EXPORT
  // =====================
  const exportPDF = async () => {
    const canvas = await html2canvas(reportRef.current);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save("financial-report.pdf");
  };

  const chartData = Object.keys(data.periods).map(year => ({
    year,
    revenue: data.periods[year]?.pnl?.revenue || 0
  }));

  const card = {
    background: "#fff",
    padding: 20,
    borderRadius: 16,
    boxShadow: "0 6px 25px rgba(0,0,0,0.08)",
    marginBottom: 20
  };

  return (
    <div style={{ background: "#f4f6fb", minHeight: "100vh", padding: 20 }}>
      <h1 style={{ textAlign: "center" }}>
        🚀 Financial Intelligence Dashboard
      </h1>

      {/* UPLOAD */}
      <motion.div style={card}>
        <h3>📤 Upload Documents</h3>

        <p>Previous Year</p>
        <input type="file" multiple onChange={e => setPreviousFiles(e.target.files)} />

        <p>Current Year</p>
        <input type="file" multiple onChange={e => setCurrentFiles(e.target.files)} />

        <button onClick={handleUpload}>Upload & Parse</button>
      </motion.div>

      {/* ANALYZE */}
      <button
        onClick={analyze}
        style={{
          width: "100%",
          padding: 15,
          background: "#4CAF50",
          color: "#fff",
          borderRadius: 10
        }}
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {/* REPORT SECTION (PDF EXPORT TARGET) */}
      <div ref={reportRef}>

        {/* CHART */}
        <div style={card}>
          <h3>📈 Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Line dataKey="revenue" stroke="#4CAF50" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* RATIOS */}
        <div style={card}>
          <h3>📊 Ratios</h3>
          <p>Current Ratio: {analysis?.ratios?.current_ratio}</p>
          <p>Net Margin: {analysis?.ratios?.net_margin}</p>
        </div>

        {/* FUNDING */}
        <div style={card}>
          <h3>🏦 Loan Eligibility</h3>
          <p>{funding?.decision}</p>
          <p>EMI: {funding?.emi}</p>
          <p>DSCR: {funding?.dscr}</p>
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

      </div>

      {/* EXPORT BUTTON */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={exportPDF}
        style={{
          width: "100%",
          padding: 15,
          marginTop: 20,
          background: "#FF5722",
          color: "#fff",
          borderRadius: 10
        }}
      >
        📄 Export PDF Report
      </motion.button>

    </div>
  );
}
