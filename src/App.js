import { useState } from "react";
import { postData } from "./api";
import { API_BASE } from "./config";

export default function App() {
  const [data, setData] = useState({
    name: "",
    periods: {
      "2024": {
        balance_sheet: { current_assets: 0, current_liabilities: 0 },
        pnl: { revenue: 0, net_profit: 0 }
      },
      "2025": {
        balance_sheet: { current_assets: 0, current_liabilities: 0 },
        pnl: { revenue: 0, net_profit: 0 }
      }
    }
  });

  const [insights, setInsights] = useState([]);
  const [forecast, setForecast] = useState({});
  const [funding, setFunding] = useState("");
  const [uploadResult, setUploadResult] = useState(null);

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

  const getInsights = async () => {
    const res = await postData("/insights", data);
    setInsights(res);
  };

  const getForecast = async () => {
    const res = await postData("/forecast", data);
    setForecast(res);
  };

  const getFunding = async () => {
    const res = await postData("/funding", data);
    setFunding(res);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      body: formData
    });

    const result = await res.json();
    setUploadResult(result);
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "auto" }}>
      <h1>📊 Financial Dashboard</h1>

      <input
        placeholder="Enter Name"
        value={data.name}
        onChange={e => setData({ ...data, name: e.target.value })}
        style={{ width: "100%", marginBottom: 10 }}
      />

      {["2024", "2025"].map(year => (
        <div key={year} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
          <h2>{year}</h2>

          <input placeholder="Assets"
            onChange={e => update(year,"balance_sheet","current_assets",e.target.value)} />

          <input placeholder="Liabilities"
            onChange={e => update(year,"balance_sheet","current_liabilities",e.target.value)} />

          <input placeholder="Revenue"
            onChange={e => update(year,"pnl","revenue",e.target.value)} />

          <input placeholder="Profit"
            onChange={e => update(year,"pnl","net_profit",e.target.value)} />
        </div>
      ))}

      <h3>Upload File</h3>
      <input type="file" onChange={handleUpload} />

      {uploadResult && (
        <pre>{JSON.stringify(uploadResult, null, 2)}</pre>
      )}

      <div style={{ marginTop: 10 }}>
        <button onClick={getInsights}>Insights</button>
        <button onClick={getForecast}>Forecast</button>
        <button onClick={getFunding}>Funding</button>
      </div>

      <h3>Insights</h3>
      {insights.map((i, idx) => <p key={idx}>{i}</p>)}

      <h3>Forecast</h3>
      <pre>{JSON.stringify(forecast, null, 2)}</pre>

      <h3>Funding</h3>
      <p>{funding}</p>
    </div>
  );
}
