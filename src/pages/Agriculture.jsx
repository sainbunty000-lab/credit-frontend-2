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

    try {

      const stored =
        JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

      if (stored.agriculture) {

        setForm(
          stored.agriculture.form || {
            documented_income: "",
            tax: "",
            undocumented_income_monthly: "",
            emi_monthly: ""
          }
        );

        setResult(stored.agriculture.result || null);

      }

    } catch {
      console.log("Local storage load failed");
    }

  }, []);

  /* SAVE STORAGE */

  useEffect(() => {

    try {

      const existing =
        JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...existing,
          agriculture: { form, result }
        })
      );

    } catch {
      console.log("Local storage save failed");
    }

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
        documented_income: Number(form.documented_income || 0),
        tax: Number(form.tax || 0),
        undocumented_income_monthly: Number(form.undocumented_income_monthly || 0),
        emi_monthly: Number(form.emi_monthly || 0)
      });

      const data = response?.data || response || {};

      const disposableIncome = Number(data.disposable_income || 0);

      const emi = Number(form.emi_monthly || 0);

      const foirPercent =
        disposableIncome > 0
          ? Number(((emi / disposableIncome) * 100).toFixed(2))
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

      <NavigationButtons prev="/" next="/banking" />

      <LOSProgress />

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

            <AgriInput label="Documented Annual" name="documented_income" value={form.documented_income} onChange={handleChange}/>
            <AgriInput label="Taxes Paid" name="tax" value={form.tax} onChange={handleChange}/>
            <AgriInput label="Monthly Informal" name="undocumented_income_monthly" value={form.undocumented_income_monthly} onChange={handleChange}/>
            <AgriInput label="Current EMI" name="emi_monthly" value={form.emi_monthly} onChange={handleChange}/>

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

        {/* RESULT */}

        {result && (

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">

            <p className="text-sm text-slate-400">Total Income</p>
            <p className="text-xl font-bold">
              {formatINR(result.total_adjusted_income)}
            </p>

            <p className="text-sm text-slate-400 mt-4">Eligible Loan</p>
            <p className="text-2xl font-bold text-emerald-400">
              {formatINR(result.eligible_loan_amount)}
            </p>

          </div>

        )}

      </div>

      <ExportCAM />

    </div>

  );

}

/* SIMPLE INPUT */

function AgriInput({ label, name, value, onChange }){

  return(

    <div>

      <p className="text-xs text-slate-400 mb-1">{label}</p>

      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-slate-800 border border-slate-700 p-2 rounded-lg"
      />

    </div>

  )

}
