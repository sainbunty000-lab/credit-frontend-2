import { useState, useEffect } from "react";
import NavigationButtons from "../components/NavigationButtons";
import LOSProgress from "../components/LOSProgress";
import ExportCAM from "../components/ExportCAM";

import { Upload, BarChart3, ShieldCheck } from "lucide-react";

import { bankingAnalyze } from "../services/api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

const STORAGE_KEY = "credit_app_v1";

export default function Banking() {

  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  /* LOAD STORAGE */

  useEffect(() => {

    const stored =
      JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

    if (stored.banking) {
      setResult(stored.banking.result || null);
    }

  }, []);

  /* SAVE STORAGE */

  useEffect(() => {

    const existing =
      JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...existing,
        banking: { result }
      })
    );

  }, [result]);

  /* ANALYZE BANK STATEMENT */

  const handleAnalyze = async () => {

    if (!file) {
      alert("Upload bank statement");
      return;
    }

    try {

      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await bankingAnalyze(formData);

      const data = response?.data || response || {};

      setResult(data.analysis || data || null);

    } catch {

      alert("Analysis failed");

    } finally {

      setLoading(false);

    }

  };

  const COLORS = ["#3b82f6", "#ef4444", "#10b981"];

  return (

    <div className="min-h-screen bg-[#070b14] p-4 sm:p-6 text-white">

      {/* NAVIGATION */}

      <NavigationButtons
        prev="/agriculture"
        next="/final"
      />

      <LOSProgress />

      {/* MAIN CONTENT */}

      <div className="space-y-10 max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex items-center gap-3">

          <BarChart3 className="text-emerald-400"/>

          <h2 className="text-2xl font-bold text-emerald-400">
            Banking Intelligence Engine
          </h2>

        </div>

        {/* FILE UPLOAD */}

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <input
              type="file"
              accept=".pdf,.csv,.xlsx"
              onChange={(e)=>setFile(e.target.files[0])}
              className="bg-slate-800 p-3 rounded-xl"
            />

            <button
              onClick={handleAnalyze}
              className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-xl"
            >
              <Upload size={16} className="inline mr-2"/>
              {loading ? "Analyzing..." : "Analyze Statement"}
            </button>

          </div>

        </div>

        {/* RESULTS */}

        {result && (

          <div className="space-y-10">

            {/* KPI */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              <Metric title="Total Credit" value={result.statement_summary?.total_credit}/>
              <Metric title="Total Debit" value={result.statement_summary?.total_debit}/>
              <Metric title="Net Surplus" value={result.statement_summary?.net_surplus}/>
              <Metric title="Salary Income" value={result.income_analysis?.salary_income}/>

            </div>

            {/* RISK INDICATOR */}

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">

              <div className="flex justify-between mb-3">

                <h3 className="text-lg text-white flex items-center gap-2">
                  <ShieldCheck size={18}/>
                  Banking Hygiene Score
                </h3>

                <span className="text-2xl font-bold text-emerald-400">
                  {result.risk_summary?.hygiene_score || 0}
                </span>

              </div>

              <div className="w-full bg-slate-800 rounded-full h-4">

                <div
                  className="h-4 rounded-full"
                  style={{
                    width:`${result.risk_summary?.hygiene_score || 0}%`,
                    background:"linear-gradient(90deg,#ef4444,#f59e0b,#22c55e)"
                  }}
                />

              </div>

              <div className="mt-2 text-sm text-slate-400">

                Risk Grade: {result.risk_summary?.risk_grade || "-"} |
                Status: {result.risk_summary?.status || "-"}

              </div>

            </div>

            {/* CHARTS */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* CASH FLOW */}

              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">

                <h3 className="text-slate-300 mb-4">
                  Monthly Cash Flow
                </h3>

                <ResponsiveContainer width="100%" height={320}>

                  <BarChart data={result.chart_data?.monthly_trend || []}>

                    <CartesianGrid strokeDasharray="3 3"/>

                    <XAxis dataKey="month"/>

                    <YAxis/>

                    <Tooltip/>

                    <Legend/>

                    <Bar dataKey="credit" fill="#3b82f6"/>

                    <Bar dataKey="debit" fill="#ef4444"/>

                  </BarChart>

                </ResponsiveContainer>

              </div>

              {/* SPENDING PIE */}

              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">

                <h3 className="text-slate-300 mb-4">
                  Spending Distribution
                </h3>

                <ResponsiveContainer width="100%" height={320}>

                  <PieChart>

                    <Pie
                      data={[
                        {
                          name:"UPI Spends",
                          value:Number(result.expense_analysis?.upi_spends || 0)
                        },
                        {
                          name:"Salary Income",
                          value:Number(result.income_analysis?.salary_income || 0)
                        }
                      ]}
                      dataKey="value"
                      outerRadius={110}
                      label
                    >

                      {COLORS.map((c,i)=>(
                        <Cell key={i} fill={c}/>
                      ))}

                    </Pie>

                    <Tooltip/>

                  </PieChart>

                </ResponsiveContainer>

              </div>

            </div>

            {/* FINANCIAL STABILITY */}

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">

              <h3 className="text-slate-300 mb-4">
                Financial Stability Indicator
              </h3>

              <div className="text-3xl font-bold text-emerald-400">
                {result.financial_indicators?.financial_strength_index || "-"}
              </div>

              <p className="text-slate-400 mt-2">
                {result.financial_indicators?.stability_tag || "-"}
              </p>

            </div>

          </div>

        )}

      </div>

      {/* EXPORT CAM */}

      <ExportCAM />

    </div>

  );

}

/* KPI CARD */

function Metric({title,value}){

  return(

    <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">

      <p className="text-slate-400 text-sm">
        {title}
      </p>

      <h2 className="text-xl font-bold mt-2 text-white">
        ₹ {Number(value || 0).toLocaleString("en-IN")}
      </h2>

    </div>

  );

}
