import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

const API = "https://your-backend.onrender.com";

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

  const [analysis, setAnalysis] = useState({});
  const [forecast, setForecast] = useState({});
  const [funding, setFunding] = useState({});

  const update = (y, s, f, v) => {
    setData(prev => ({
      ...prev,
      periods: {
        ...prev.periods,
        [y]: {
          ...prev.periods[y],
          [s]: {
            ...prev.periods[y][s],
            [f]: Number(v)
          }
        }
      }
    }));
  };

  const analyze = async () => {
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
  };

  const chartData = [
    { year: "2024", revenue: data.periods["2024"].pnl.revenue },
    { year: "2025", revenue: data.periods["2025"].pnl.revenue }
  ];

  return (
    <div style={{ background: "#f4f6f9", padding: 20 }}>
      <h1>📊 Financial Dashboard</h1>

      <input placeholder="Name"
        onChange={e => setData({ ...data, name: e.target.value })} />

      {["2024","2025"].map(y => (
        <div key={y}>
          <h3>{y}</h3>
          <input placeholder="Assets" onChange={e => update(y,"balance_sheet","current_assets",e.target.value)} />
          <input placeholder="Liabilities" onChange={e => update(y,"balance_sheet","current_liabilities",e.target.value)} />
          <input placeholder="Revenue" onChange={e => update(y,"pnl","revenue",e.target.value)} />
          <input placeholder="Profit" onChange={e => update(y,"pnl","net_profit",e.target.value)} />
        </div>
      ))}

      <button onClick={analyze}>Analyze</button>

      <h3>Insights</h3>
      {analysis?.insights?.map((i,idx)=><p key={idx}>{i}</p>)}

      <h3>Ratios</h3>
      <p>Current Ratio: {analysis?.ratios?.current_ratio}</p>
      <p>Net Margin: {analysis?.ratios?.net_margin}</p>

      <h3>Risk</h3>
      <p>{analysis?.risk_score}</p>

      <h3>Chart</h3>
      <LineChart width={300} height={200} data={chartData}>
        <XAxis dataKey="year" />
        <YAxis />
        <Tooltip />
        <Line dataKey="revenue" />
      </LineChart>

      <h3>Forecast</h3>
      <pre>{JSON.stringify(forecast,null,2)}</pre>

      <h3>Loan</h3>
      <p>{funding?.decision}</p>
      <p>EMI: {funding?.emi}</p>
      <p>DSCR: {funding?.dscr}</p>
    </div>
  );
}
