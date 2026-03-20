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
  const [loading, setLoading] = useState(false);

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

  // 🔥 AUTO-FILL FROM UPLOAD
  const handleUpload = async (e, type) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("doc_type", type);

    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      body: formData
    });

    const result = await res.json();

    if (result.extracted) {
      setData(prev => ({
        ...prev,
        periods: {
          ...prev.periods,
          "2025": {
            ...prev.periods["2025"],
            ...(type === "bs"
              ? {
                  balance_sheet: {
                    ...prev.periods["2025"].balance_sheet,
                    ...result.extracted
                  }
                }
              : {
                  pnl: {
                    ...prev.periods["2025"].pnl,
                    ...result.extracted
                  }
                })
          }
        }
      }));
    }
  };

  const analyzeAll = async () => {
    setLoading(true);

    try {
      const [ins, fore, fund] = await Promise.all([
        postData("/insights", data),
        postData("/forecast", data),
        postData("/funding", data)
      ]);

      setInsights(Array.isArray(ins) ? ins : []);
      setForecast(fore || {});
      setFunding(typeof fund === "string" ? fund : "");

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
      <h1>📊 Financial Dashboard</h1>

      <input
        placeholder="Name"
        value={data.name}
        onChange={e => setData({ ...data, name: e.target.value })}
        style={{ width: "100%", marginBottom: 20 }}
      />

      {["2024", "2025"].map(year => (
        <div key={year} style={{ border: "1px solid #ccc", padding: 15, marginBottom: 10 }}>
          <h2>{year}</h2>

          <input placeholder="Assets"
            value={data.periods[year].balance_sheet.current_assets}
            onChange={e => update(year,"balance_sheet","current_assets",e.target.value)} />

          <input placeholder="Liabilities"
            value={data.periods[year].balance_sheet.current_liabilities}
            onChange={e => update(year,"balance_sheet","current_liabilities",e.target.value)} />

          <input placeholder="Revenue"
            value={data.periods[year].pnl.revenue}
            onChange={e => update(year,"pnl","revenue",e.target.value)} />

          <input placeholder="Profit"
            value={data.periods[year].pnl.net_profit}
            onChange={e => update(year,"pnl","net_profit",e.target.value)} />
        </div>
      ))}

      <h3>📊 Upload Balance Sheet</h3>
      <input type="file" onChange={(e) => handleUpload(e, "bs")} />

      <h3>📈 Upload P&L</h3>
      <input type="file" onChange={(e) => handleUpload(e, "pnl")} />

      <button onClick={analyzeAll} style={{ marginTop: 20 }}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      <h3>Insights</h3>
      {insights.map((i, idx) => <p key={idx}>{i}</p>)}

      <h3>Forecast</h3>
      <pre>{JSON.stringify(forecast, null, 2)}</pre>

      <h3>Funding</h3>
      <p>{funding}</p>
    </div>
  );
}
