import { useState, useEffect } from "react";
import {
  UploadCloud,
  Calculator,
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Wallet,
  ArrowUpRight,
  FileText,
  IndianRupee,
  Eye,
  EyeOff
} from "lucide-react";

import AnimatedKPI from "../../components/cards/AnimatedKPI";
import MetricCard from "../../components/cards/MetricCard";
import SectionCard from "../../components/cards/SectionCard";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

const API = "https://credit-backend-production-d988.up.railway.app";
const STORAGE_KEY = "credit_app_v1";

export default function WorkingCapital() {

  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

  const [balanceSheet, setBalanceSheet] = useState(null);
  const [profitLoss, setProfitLoss] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(true);

  const [form, setForm] = useState(
    stored.workingCapital?.form || {
      current_assets: "",
      current_liabilities: "",
      inventory: "",
      receivables: "",
      annual_sales: "",
      cogs: ""
    }
  );

  const [result, setResult] = useState(
    stored.workingCapital?.result || null
  );

  const formatINR = (val) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val || 0);

  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...existing, workingCapital: { form, result } })
    );
  }, [form, result]);

  // =============================
  // FILE EXTRACTION
  // =============================

  const extractFiles = async () => {

    if (!balanceSheet || !profitLoss)
      return alert("Upload both files");

    const fd = new FormData();
    fd.append("balance_sheet", balanceSheet);
    fd.append("profit_loss", profitLoss);

    try {

      setLoading(true);

      const res = await fetch(`${API}/wc/upload-dual`, {
        method: "POST",
        body: fd
      });

      const data = await res.json();

      setLoading(false);

      if (data) {
        setForm(data.extracted_values || data);
        setResult(data.calculations || null);
        setShowResults(true);
      }

    } catch {
      setLoading(false);
      alert("Server Error");
    }
  };

  // =============================
  // CALCULATE
  // =============================

  const calculate = () => {

    const ca = Number(form.current_assets || 0);
    const cl = Number(form.current_liabilities || 0);
    const sales = Number(form.annual_sales || 0);

    const nwc = ca - cl;
    const current_ratio = cl ? ca / cl : 0;
    const wc_turnover = nwc ? sales / nwc : 0;

    const mpbf_limit = sales * 0.25;
    const turnover_limit = sales * 0.20;
    const drawing_power = nwc > 0 ? nwc * 0.75 : 0;

    let score = 0;
    score += current_ratio > 1.5 ? 30 : 15;
    score += wc_turnover > 3 ? 30 : 15;
    score += drawing_power > 0 ? 40 : 20;

    setResult({
      nwc,
      current_ratio: Number(current_ratio.toFixed(2)),
      wc_turnover: Number(wc_turnover.toFixed(2)),
      mpbf_limit,
      turnover_limit,
      drawing_power,
      liquidity_score: score
    });

    setShowResults(true);
  };

  return (

    <div className="min-h-screen bg-[#070b14] p-6 text-slate-200">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-10 max-w-7xl mx-auto">

        <div className="flex items-center gap-4">

          <BarChart3 className="text-blue-500 w-8 h-8" />

          <div>
            <h2 className="text-3xl font-extrabold text-white">
              Working Capital Analysis
            </h2>
            <p className="text-slate-500 text-sm">
              Financial liquidity & MPBF assessment
            </p>
          </div>

        </div>

        {result && (

          <button
            onClick={() => setShowResults(!showResults)}
            className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-xl"
          >
            {showResults ? <EyeOff size={18} /> : <Eye size={18} />}
            {showResults ? "Hide Analysis" : "Show Analysis"}
          </button>

        )}

      </div>

      <div className="max-w-7xl mx-auto space-y-8">

        {/* FILE UPLOAD */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <UploadCard
            label="Balance Sheet"
            icon={<FileText size={20} />}
            onChange={(e) => setBalanceSheet(e.target.files[0])}
          />

          <UploadCard
            label="Profit & Loss"
            icon={<TrendingUp size={20} />}
            onChange={(e) => setProfitLoss(e.target.files[0])}
          />

          <button
            onClick={extractFiles}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl flex items-center justify-center gap-2"
          >
            <UploadCloud size={20} />
            {loading ? "Processing..." : "Extract Data"}
          </button>

        </div>

        {/* INPUTS */}

        <div className="bg-[#0f172a]/40 p-8 rounded-3xl border border-slate-800">

          <h3 className="text-white font-semibold mb-6">
            Verification & Adjustments
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <InputField label="Current Assets" value={form.current_assets} onChange={(v)=>setForm({...form,current_assets:v})}/>
            <InputField label="Current Liabilities" value={form.current_liabilities} onChange={(v)=>setForm({...form,current_liabilities:v})}/>
            <InputField label="Inventory" value={form.inventory} onChange={(v)=>setForm({...form,inventory:v})}/>
            <InputField label="Receivables" value={form.receivables} onChange={(v)=>setForm({...form,receivables:v})}/>
            <InputField label="Annual Sales" value={form.annual_sales} onChange={(v)=>setForm({...form,annual_sales:v})}/>
            <InputField label="COGS" value={form.cogs} onChange={(v)=>setForm({...form,cogs:v})}/>

          </div>

          <div className="mt-8">

            <button
              onClick={calculate}
              className="bg-white text-slate-900 px-10 py-3 rounded-xl flex items-center gap-2 font-bold"
            >
              <Calculator size={18}/>
              Run Financial Model
            </button>

          </div>

        </div>

        {/* RESULTS */}

        {result && showResults && (

          <div className="space-y-10">

            {/* KPI */}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

              <AnimatedKPI title="NWC" value={formatINR(result.nwc)} icon={<Wallet/>}/>
              <AnimatedKPI title="Current Ratio" value={result.current_ratio} icon={<ShieldCheck/>}/>
              <AnimatedKPI title="WC Turnover" value={result.wc_turnover} icon={<ArrowUpRight/>}/>
              <AnimatedKPI title="Drawing Power" value={formatINR(result.drawing_power)} icon={<IndianRupee/>}/>

            </div>


            {/* MPBF + RISK */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              <div className="lg:col-span-2">

                <SectionCard title="Bank Finance Assessment (MPBF)">

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

                    <MetricCard title="Drawing Power" value={formatINR(result.drawing_power)}/>
                    <MetricCard title="MPBF Eligible" value={formatINR(result.mpbf_limit)}/>
                    <MetricCard title="Turnover Limit" value={formatINR(result.turnover_limit)}/>
                    <MetricCard title="Final Eligibility" value={formatINR(Math.max(result.mpbf_limit,result.turnover_limit))}/>

                  </div>

                  <div className="mt-10">

                    <div className="text-sm text-slate-400 mb-2">
                      Liquidity Health Index
                    </div>

                    <div className="w-full bg-slate-800 rounded-full h-3">

                      <div
                        className="h-3 rounded-full"
                        style={{
                          width:`${result.liquidity_score}%`,
                          background:"linear-gradient(90deg,#ef4444,#f59e0b,#22c55e)"
                        }}
                      />

                    </div>

                    <div className="text-right text-sm mt-1">
                      {result.liquidity_score}%
                    </div>

                  </div>

                </SectionCard>

              </div>


              {/* CHART */}

              <div className="bg-[#0f172a] p-6 rounded-3xl border border-slate-800">

                <h3 className="text-white text-sm font-bold mb-6 flex items-center gap-2">
                  <BarChart3 size={18}/>
                  Asset Composition
                </h3>

                <ResponsiveContainer width="100%" height={280}>

                  <BarChart
                    data={[
                      {name:"Assets",value:Number(form.current_assets||0)},
                      {name:"Liabilities",value:Number(form.current_liabilities||0)},
                      {name:"NWC",value:result.nwc}
                    ]}
                  >

                    <XAxis dataKey="name"/>
                    <YAxis hide/>
                    <Tooltip/>

                    <Bar dataKey="value" radius={[6,6,0,0]}>

                      <Cell fill="#3b82f6"/>
                      <Cell fill="#ef4444"/>
                      <Cell fill="#10b981"/>

                    </Bar>

                  </BarChart>

                </ResponsiveContainer>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>

  );
}



function InputField({label,value,onChange}){

  return(

    <div>

      <label className="text-xs text-slate-500 uppercase">
        {label}
      </label>

      <div className="relative mt-1">

        <span className="absolute left-3 top-3 text-blue-400">
          ₹
        </span>

        <input
          type="number"
          value={value||""}
          onChange={(e)=>onChange(e.target.value)}
          className="w-full bg-[#070b14] text-white pl-8 pr-3 py-3 rounded-xl border border-slate-800"
        />

      </div>

    </div>

  )

}



function UploadCard({label,icon,onChange}){

  return(

    <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800">

      <div className="flex items-center gap-2 mb-3 text-slate-400">
        {icon}
        <span className="text-sm font-semibold">{label}</span>
      </div>

      <input
        type="file"
        onChange={onChange}
        className="w-full text-xs text-slate-400"
      />

    </div>

  )

                  }
