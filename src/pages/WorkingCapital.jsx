import { useState, useCallback } from "react";
import NavigationButtons from "../components/NavigationButtons";
import { UploadCloud, BarChart3, AlertTriangle, CheckCircle } from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";

import { analyzeStatement, wcManualCalc } from "../services/api";
import { handleApiError } from "../utils/errorHandler";
import { saveApp, loadApp } from "../services/appStorage";

const RISK_COLORS = {
  A: "#22c55e",
  B: "#86efac",
  C: "#eab308",
  D: "#f97316",
  E: "#ef4444",
};

const MISSING_FIELD_LABELS = {
  current_assets: "Current Assets",
  current_liabilities: "Current Liabilities",
  inventory: "Inventory",
  receivables: "Receivables",
  payables: "Payables",
  cash_bank: "Cash & Bank",
  bank_credit: "Bank Credit",
  annual_sales: "Annual Sales",
  other_income: "Other Income",
  operating_expenses: "Operating Expenses",
  interest_expense: "Interest Expense",
  depreciation: "Depreciation",
  tax: "Tax",
};

const BAR_COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"];
const PIE_COLORS = ["#10b981", "#3b82f6", "#f59e0b"];

export default function WorkingCapital() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [missingFields, setMissingFields] = useState([]);
  const [manualData, setManualData] = useState({});
  const [error, setError] = useState("");

  const formatINR = (v) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Math.round(v || 0));

  const handleFileSelect = useCallback((f) => {
    if (f && f.type === "application/pdf") {
      setFile(f);
      setError("");
    } else {
      setError("Please upload a valid PDF file.");
    }
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    handleFileSelect(f);
  }, [handleFileSelect]);

  const onDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const onDragLeave = () => setDragging(false);

  const analyze = async () => {
    if (!file) {
      setError("Please upload a PDF file first.");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const fd = new FormData();
      fd.append("file", file);
      const response = await analyzeStatement(fd);
      if (response.status === "success") {
        setResult(response.data);
        setMissingFields(response.missing_fields || []);
        const app = loadApp();
        app.workingCapital = { result: response.data };
        saveApp(app);
      } else {
        setError("Analysis failed. Please try again.");
      }
    } catch (err) {
      setError(handleApiError(err, "Server error. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const resubmitManual = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await wcManualCalc(manualData);
      const resultData = response.data || response;
      setResult(resultData);
      setMissingFields([]);
      const app = loadApp();
      app.workingCapital = { result: resultData };
      saveApp(app);
    } catch (err) {
      setError(handleApiError(err, "Server error. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const riskColor = RISK_COLORS[result?.risk?.risk_grade] || "#64748b";

  const gapChartData =
    result?.charts?.gap_chart?.length > 0
      ? result.charts.gap_chart
      : [
          { name: "GCA", value: result?.mpbf_analysis?.gca || 0 },
          { name: "CL", value: result?.mpbf_analysis?.cl || 0 },
          { name: "WCG", value: result?.mpbf_analysis?.wcg || 0 },
          { name: "MPBF", value: result?.mpbf_analysis?.mpbf || 0 },
        ];

  const compositionChartData =
    result?.charts?.composition_chart?.length > 0
      ? result.charts.composition_chart
      : [];

  return (
    <div className="min-h-screen bg-[#070b14] p-4 pt-20 pb-32 text-slate-200">
      <NavigationButtons prev="/" next="/agriculture" />

      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex items-center gap-3">
          <BarChart3 className="text-blue-400" />
          <h2 className="text-2xl font-bold">Working Capital Analysis</h2>
        </div>

        {/* UPLOAD SECTION */}
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
            dragging
              ? "border-blue-400 bg-blue-900/20"
              : "border-slate-700 bg-slate-900"
          }`}
        >
          <UploadCloud size={40} className="mx-auto mb-3 text-blue-400" />
          <p className="text-slate-300 mb-1 font-medium">
            Drag & drop your financial statement PDF here
          </p>
          <p className="text-slate-500 text-sm mb-4">
            Balance Sheet or Profit & Loss — PDF only
          </p>
          <label className="cursor-pointer inline-block bg-blue-700 hover:bg-blue-600 transition-colors px-5 py-2 rounded-lg text-sm font-medium">
            Browse File
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files[0])}
            />
          </label>
          {file && (
            <p className="mt-4 text-sm text-emerald-400 flex items-center justify-center gap-2">
              <CheckCircle size={16} />
              {file.name}
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-xl flex items-start gap-2">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        <button
          onClick={analyze}
          disabled={loading || !file}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl flex items-center gap-2 font-medium transition-colors"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing…
            </>
          ) : (
            <>
              <UploadCloud size={18} />
              Analyze Statement
            </>
          )}
        </button>

        {/* RESULTS */}
        {result && (
          <div className="space-y-8">

            {/* FINANCIAL RATIOS */}
            <section>
              <h3 className="text-lg font-semibold mb-4 text-blue-300">
                Financial Ratios
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Metric title="Net Working Capital" value={formatINR(result.ratios?.nwc)} />
                <Metric title="Current Ratio" value={(result.ratios?.current_ratio || 0).toFixed(2)} />
                <Metric title="Quick Ratio" value={(result.ratios?.quick_ratio || 0).toFixed(2)} />
                <Metric title="WC Turnover" value={(result.ratios?.wc_turnover || 0).toFixed(2)} />
                <Metric title="Operating Cycle (days)" value={Math.round(result.ratios?.operating_cycle || 0)} />
                <Metric title="Drawing Power" value={formatINR(result.ratios?.drawing_power)} />
              </div>
            </section>

            {/* MPBF ANALYSIS */}
            <section>
              <h3 className="text-lg font-semibold mb-4 text-blue-300">
                MPBF Analysis
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Metric title="Gross Current Assets" value={formatINR(result.mpbf_analysis?.gca)} />
                <Metric title="Current Liabilities" value={formatINR(result.mpbf_analysis?.cl)} />
                <Metric title="Working Capital Gap" value={formatINR(result.mpbf_analysis?.wcg)} />
                <Metric title="Borrower Margin" value={formatINR(result.mpbf_analysis?.margin)} />
                <Metric title="MPBF" value={formatINR(result.mpbf_analysis?.mpbf)} />
                <Metric title="Turnover Limit" value={formatINR(result.mpbf_analysis?.turnover_limit)} />
                <Metric
                  title="Recommended Credit Limit"
                  value={formatINR(result.mpbf_analysis?.recommended_limit)}
                  highlight
                />
              </div>
            </section>

            {/* WCG BAR CHART */}
            <section className="bg-slate-900 p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-4">
                Working Capital Gap Chart
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={gapChartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" tick={{ fill: "#94a3b8" }} />
                  <YAxis tick={{ fill: "#94a3b8" }} />
                  <Tooltip
                    contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "8px" }}
                    formatter={(v) => formatINR(v)}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {gapChartData.map((entry, i) => (
                      <Cell key={entry.name} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </section>

            {/* ASSET COMPOSITION PIE CHART */}
            {compositionChartData.length > 0 && (
              <section className="bg-slate-900 p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">
                  Asset Composition
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={compositionChartData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {compositionChartData.map((entry, i) => (
                        <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: "#0f172a", border: "1px solid #334155", borderRadius: "8px" }}
                      formatter={(v) => formatINR(v)}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </section>
            )}

            {/* RISK ASSESSMENT */}
            <section className="bg-slate-900 p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-4">Risk Assessment</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-slate-800 p-5 rounded-xl text-center">
                  <p className="text-sm text-slate-400 mb-2">Risk Score</p>
                  <h2 className="text-4xl font-bold" style={{ color: riskColor }}>
                    {result.risk?.risk_score ?? "—"}
                  </h2>
                </div>
                <div className="bg-slate-800 p-5 rounded-xl text-center">
                  <p className="text-sm text-slate-400 mb-2">Risk Grade</p>
                  <h2 className="text-4xl font-bold" style={{ color: riskColor }}>
                    {result.risk?.risk_grade || "—"}
                  </h2>
                  <RiskGradeLegend />
                </div>
                <div className="bg-slate-800 p-5 rounded-xl text-center">
                  <p className="text-sm text-slate-400 mb-2">Eligibility</p>
                  <h2
                    className="text-2xl font-bold mt-1"
                    style={{
                      color: result.status === "Eligible" ? "#22c55e" : "#ef4444",
                    }}
                  >
                    {result.status || "—"}
                  </h2>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* MISSING FIELDS PANEL */}
        {missingFields.length > 0 && (
          <section className="bg-amber-900/20 border border-amber-700 p-6 rounded-xl">
            <div className="flex items-center gap-2 mb-2 text-amber-400">
              <AlertTriangle size={20} />
              <h3 className="text-lg font-semibold">
                {missingFields.length} Missing Field
                {missingFields.length > 1 ? "s" : ""} Detected
              </h3>
            </div>
            <p className="text-sm text-slate-300 mb-5">
              The document is missing some financial data. Please enter the
              values below and resubmit for a complete analysis.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {missingFields.map((field) => (
                <div key={field}>
                  <label className="text-sm text-slate-400 block mb-1">
                    {MISSING_FIELD_LABELS[field] || field}
                  </label>
                  <input
                    type="number"
                    placeholder="Enter value"
                    className="bg-slate-900 border border-slate-700 focus:border-amber-500 outline-none rounded-lg px-3 py-2 w-full text-white"
                    onChange={(e) =>
                      setManualData((prev) => ({
                        ...prev,
                        [field]: parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
              ))}
            </div>
            <button
              onClick={resubmitManual}
              disabled={loading}
              className="mt-5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing…
                </>
              ) : (
                "Resubmit with Manual Data"
              )}
            </button>
          </section>
        )}

      </div>
    </div>
  );
}

/* METRIC CARD */
function Metric({ title, value, highlight }) {
  return (
    <div
      className={`p-5 rounded-xl ${
        highlight
          ? "bg-blue-900/30 border border-blue-700"
          : "bg-slate-900"
      }`}
    >
      <p className="text-sm text-slate-400">{title}</p>
      <h2
        className={`text-xl font-bold mt-2 ${
          highlight ? "text-blue-300" : ""
        }`}
      >
        {value}
      </h2>
    </div>
  );
}

/* RISK GRADE LEGEND */
function RiskGradeLegend() {
  const grades = [
    { grade: "A", color: "#22c55e" },
    { grade: "B", color: "#86efac" },
    { grade: "C", color: "#eab308" },
    { grade: "D", color: "#f97316" },
    { grade: "E", color: "#ef4444" },
  ];
  return (
    <div className="flex justify-center gap-2 mt-3">
      {grades.map(({ grade, color }) => (
        <span
          key={grade}
          className="text-xs font-bold px-2 py-0.5 rounded"
          style={{ background: color + "33", color }}
        >
          {grade}
        </span>
      ))}
    </div>
  );
}
