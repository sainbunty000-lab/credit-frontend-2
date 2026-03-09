import { useState, useEffect } from "react";
import NavigationButtons from "../components/NavigationButtons";
import LOSProgress from "../components/LOSProgress";
import ExportCAM from "../components/ExportCAM";

import {
  Leaf,
  Calculator,
  TrendingUp,
  FileText,
  CheckCircle2,
  XCircle,
  ShieldAlert
} from "lucide-react";

import { agriCalculate } from "../services/api";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

const STORAGE_KEY = "credit_app_v1";

export default function Agriculture() {

  const [form, setForm] = useState({
    documented_income: "",
    tax: "",
    undocumented_income_monthly: "",
    emi_monthly: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* LOAD STORAGE */

  useEffect(() => {

    const stored =
      JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

    if (stored.agriculture) {
      setForm(stored.agriculture.form || {});
      setResult(stored.agriculture.result || null);
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
        agriculture: { form, result }
      })
    );

  }, [form, result]);

  const formatINR = (val) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(Math.round(val || 0));

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));

  };

  /* AGRICULTURE CALCULATION */

  const handleSubmit = async () => {

    setError("");
    setLoading(true);

    try {

      const response = await agriCalculate({
        documented_income: Number(form.documented_income),
        tax: Number(form.tax),
        undocumented_income_monthly: Number(form.undocumented_income_monthly),
        emi_monthly: Number(form.emi_monthly)
      });

      const data = response?.data || response || {};

      const disposableIncome = data.disposable_income || 0;

      const emi = Number(form.emi_monthly || 0);

      const foirPercent =
        disposableIncome
          ? ((emi / disposableIncome) * 100).toFixed(2)
          : 0;

      data.foir_percent = foirPercent;

      setResult(data);

    } catch (err) {

      console.error(err);
      setError("Policy Engine Error: Unable to compute agriculture eligibility.");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-[#070b14] p-4 sm:p-6 text-white">

      {/* NAVIGATION */}

      <NavigationButtons
        prev="/"
        next="/banking"
      />

      <LOSProgress />

      {/* MAIN CONTAINER */}

      <div className="bg-slate-950 p-4 sm:p-6 rounded-3xl border border-slate-800 space-y-8">

        {/* HEADER */}

        <div className="flex justify-between items-center bg-slate-900/40 p-6 rounded-2xl border border-slate-800">

          <div className="flex items-center gap-4">

            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <Leaf className="text-emerald-500 w-8 h-8"/>
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                Agriculture Credit Intelligence
              </h2>

              <p className="text-slate-500 text-xs uppercase tracking-widest">
                Dual Model Underwriting
              </p>
            </div>

          </div>

          {result && (

            <div
              className={`px-4 py-2 rounded-xl border font-black text-sm uppercase flex items-center gap-2 ${
                result.status === "Rejected"
                  ? "border-red-500 text-red-500"
                  : "border-emerald-500 text-emerald-500"
              }`}
            >

              {result.status === "Rejected"
                ? <XCircle size={16}/>
                : <CheckCircle2 size={16}/>}

              {result.status}

            </div>

          )}

        </div>

        {/* INPUT */}

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <AgriInput label="Documented Annual" name="documented_income" value={form.documented_income} onChange={handleChange} icon={<FileText size={16}/>}/>
            <AgriInput label="Taxes Paid" name="tax" value={form.tax} onChange={handleChange} icon={<ShieldAlert size={16}/>}/>
            <AgriInput label="Monthly Informal" name="undocumented_income_monthly" value={form.undocumented_income_monthly} onChange={handleChange} icon={<TrendingUp size={16}/>}/>
            <AgriInput label="Current EMI" name="emi_monthly" value={form.emi_monthly} onChange={handleChange} icon={<Calculator size={16}/>}/>

          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-8 bg-emerald-600 hover:bg-emerald-500 px-8 py-3 rounded-xl font-bold uppercase"
          >
            {loading ? "Computing..." : "Run Agriculture Analysis"}
          </button>

        </div>

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

        {/* RESULTS */}

        {result && (

          <div className="space-y-8">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">

              <MetricCard title="Total Income" value={formatINR(result.total_adjusted_income)}/>
              <MetricCard title="Disposable" value={formatINR(result.disposable_income)}/>
              <MetricCard title="EMI Model" value={formatINR(result.eligible_loan_emi_model)}/>
              <MetricCard title="Policy Model" value={formatINR(result.eligible_loan_policy_model)}/>
              <MetricCard title="Final Eligible" value={formatINR(result.eligible_loan_amount)} highlight/>
              <MetricCard title="Risk Grade" value={result.risk_grade} grade={result.risk_grade}/>

            </div>

            {/* FOIR */}

            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">

              <div className="flex justify-between mb-3">

                <h4 className="text-xs uppercase text-slate-400">
                  FOIR Analysis
                </h4>

                <span className={`text-2xl font-bold ${result.foir_percent > 60 ? "text-red-500" : "text-emerald-500"}`}>
                  {result.foir_percent}%
                </span>

              </div>

              <div className="w-full bg-slate-800 rounded-full h-3">

                <div
                  className={`${result.foir_percent > 60 ? "bg-red-500" : "bg-emerald-500"} h-full`}
                  style={{ width: `${Math.min(result.foir_percent || 0, 100)}%` }}
                />

              </div>

            </div>

            {/* CHARTS */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              <ChartIncomeSplit result={result}/>
              <ChartLoanModels result={result}/>
              <ChartStress result={result} form={form}/>

            </div>

          </div>

        )}

      </div>

      {/* EXPORT CAM */}

      <ExportCAM />

    </div>

  );

}
