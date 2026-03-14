import { useEffect, useState } from "react";
import {
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
CartesianGrid,
PieChart,
Pie,
Cell
} from "recharts";

import NavigationButtons from "../components/NavigationButtons";
import { STORAGE_KEY } from "../config/constants";

export default function FinalReport(){

const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

const wcData = stored?.workingCapital?.result || {};
const agriData = stored?.agriculture?.result || {};
const bankData = stored?.banking?.result || {};

const ratios = wcData?.ratios || {};
const mpbf = wcData?.mpbf_analysis || {};
const risk = wcData?.risk || {};

const formatINR = (val)=>
new Intl.NumberFormat("en-IN",{
style:"currency",
currency:"INR",
maximumFractionDigits:0
}).format(Math.round(val || 0));


/* =========================
WORKING CAPITAL CHART DATA
========================= */

const wcChart = [
{
name:"NWC",
value: ratios?.nwc || 0
},
{
name:"MPBF",
value: mpbf?.mpbf || 0
},
{
name:"Limit",
value: mpbf?.recommended_limit || 0
}
];


/* =========================
AGRI PIE CHART
========================= */

const agriPie = [
{
name:"Disposable Income",
value: agriData?.disposable_income || 0
},
{
name:"EMI Capacity",
value: agriData?.eligible_loan || 0
}
];


/* =========================
BANKING BAR CHART
========================= */

const bankChart = [
{
name:"Credit",
value: bankData?.statement_summary?.total_credit || 0
},
{
name:"Debit",
value: bankData?.statement_summary?.total_debit || 0
}
];


/* =========================
FINAL CREDIT SCORE
========================= */

const score =
(risk?.risk_score || 0) +
(agriData?.foir_score || 0) +
(bankData?.risk_summary?.hygiene_score || 0);

const finalScore = Math.min(100,Math.round(score/3));

const decision = finalScore >= 70 ? "APPROVED" : "REVIEW";


return(

<div className="min-h-screen bg-[#070b14] text-slate-200 p-4 sm:p-6 pt-20 pb-32">

<NavigationButtons prev="/agriculture" next="/" />

<div className="max-w-7xl mx-auto space-y-10">


{/* =====================================
EXECUTIVE CREDIT SUMMARY
===================================== */}

<div className="bg-[#0f172a] p-6 rounded-3xl border border-slate-800">

<h2 className="text-xl font-bold text-emerald-400 mb-6">
Executive Credit Summary
</h2>

<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

<Metric title="Credit Score" value={finalScore}/>

<Metric title="Decision" value={decision}/>

<Metric
title="Recommended Limit"
value={formatINR(mpbf?.recommended_limit)}
/>

<Metric title="Model" value="AI Underwriting"/>

</div>

</div>


{/* =====================================
WORKING CAPITAL ASSESSMENT
===================================== */}

<div className="bg-[#0f172a] p-6 rounded-3xl border border-slate-800">

<h2 className="text-lg font-semibold text-emerald-400 mb-4">
Working Capital Assessment
</h2>

<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

<Metric
title="Current Ratio"
value={(ratios?.current_ratio || 0).toFixed(2)}
/>

<Metric
title="WC Turnover"
value={(ratios?.wc_turnover || 0).toFixed(2)}
/>

<Metric
title="Drawing Power"
value={formatINR(ratios?.drawing_power)}
/>

</div>

<ResponsiveContainer width="100%" height={280}>

<BarChart data={wcChart}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="name"/>

<YAxis/>

<Tooltip/>

<Bar dataKey="value">

<Cell fill="#3b82f6"/>
<Cell fill="#10b981"/>
<Cell fill="#f59e0b"/>

</Bar>

</BarChart>

</ResponsiveContainer>

</div>


{/* =====================================
WORKING CAPITAL LOGIC
===================================== */}

<div className="bg-[#0f172a] p-6 rounded-3xl border border-slate-800">

<h3 className="text-white font-semibold mb-4">
Working Capital Model Logic
</h3>

<ul className="text-sm text-slate-300 space-y-2">

<li>NWC = Current Assets − Current Liabilities</li>

<li>Current Ratio = Current Assets ÷ Current Liabilities</li>

<li>Quick Ratio = (CA − Inventory) ÷ CL</li>

<li>Operating Cycle = Inventory Days + Receivable Days</li>

<li>Gap Days = Operating Cycle − Payable Days</li>

<li>MPBF = Working Capital Gap − Margin (25%)</li>

<li>Turnover Method = 20% of Annual Sales</li>

<li>Drawing Power = 75% Debtors + 50% Stock</li>

</ul>

</div>


{/* =====================================
AGRICULTURE INCOME
===================================== */}

<div className="bg-[#0f172a] p-6 rounded-3xl border border-slate-800">

<h2 className="text-lg font-semibold text-emerald-400 mb-6">
Agriculture Income Assessment
</h2>

<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

<Metric
title="Disposable Income"
value={formatINR(agriData?.disposable_income)}
/>

<Metric
title="FOIR %"
value={(agriData?.foir || 0).toFixed(2)}
/>

<Metric
title="Eligible Loan"
value={formatINR(agriData?.eligible_loan)}
/>

</div>

<ResponsiveContainer width="100%" height={260}>

<PieChart>

<Pie
data={agriPie}
dataKey="value"
nameKey="name"
outerRadius={90}
label
>

<Cell fill="#10b981"/>
<Cell fill="#3b82f6"/>

</Pie>

<Tooltip/>

</PieChart>

</ResponsiveContainer>

</div>


{/* =====================================
BANKING BEHAVIOUR
===================================== */}

<div className="bg-[#0f172a] p-6 rounded-3xl border border-slate-800">

<h2 className="text-lg font-semibold text-emerald-400 mb-6">
Banking Behaviour Analysis
</h2>

<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">

<Metric
title="Total Credit"
value={formatINR(bankData?.statement_summary?.total_credit)}
/>

<Metric
title="Total Debit"
value={formatINR(bankData?.statement_summary?.total_debit)}
/>

<Metric
title="Bounce Count"
value={bankData?.behavior_analysis?.bounce_count || 0}
/>

</div>

<ResponsiveContainer width="100%" height={260}>

<BarChart data={bankChart}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="name"/>

<YAxis/>

<Tooltip/>

<Bar dataKey="value">

<Cell fill="#22c55e"/>
<Cell fill="#ef4444"/>

</Bar>

</BarChart>

</ResponsiveContainer>

</div>


{/* =====================================
RISK ASSESSMENT
===================================== */}

<div className="bg-[#0f172a] p-6 rounded-3xl border border-slate-800">

<h2 className="text-lg font-semibold text-emerald-400 mb-4">
Risk Assessment
</h2>

<p className="text-slate-300 text-sm">

Credit score derived from integrated financial model combining
working capital ratios, agriculture income stability and banking
transaction hygiene.

</p>

<div className="mt-4">

<Metric
title="Risk Grade"
value={risk?.risk_grade || "NA"}
/>

</div>

</div>


{/* =====================================
FINAL CREDIT RECOMMENDATION
===================================== */}

<div className="bg-[#0f172a] p-6 rounded-3xl border border-slate-800">

<h2 className="text-lg font-semibold text-emerald-400 mb-4">
Final Credit Recommendation
</h2>

<h3 className="text-3xl font-bold text-emerald-400">
{formatINR(mpbf?.recommended_limit)}
</h3>

<p className="text-sm text-slate-400 mt-2">
Decision: {decision}
</p>

</div>

</div>

</div>

);

}


/* =========================
METRIC CARD
========================= */

function Metric({title,value}){

return(

<div className="bg-[#020617] p-4 rounded-xl border border-slate-800">

<p className="text-slate-400 text-sm">
{title}
</p>

<h3 className="text-lg font-bold text-white mt-2">
{value}
</h3>

</div>

);

}
