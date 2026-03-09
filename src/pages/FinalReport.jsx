import { useState, useEffect } from "react";
import {
UploadCloud,
Calculator,
BarChart3,
TrendingUp,
FileText,
Eye,
EyeOff
} from "lucide-react";

import {
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
CartesianGrid,
Cell
} from "recharts";

import NavigationButtons from "../components/NavigationButtons";

const API = "https://credit-backend-production-d988.up.railway.app";
const STORAGE_KEY = "credit_app_v1";

export default function WorkingCapital(){

const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

const [balanceSheet,setBalanceSheet] = useState(null);
const [profitLoss,setProfitLoss] = useState(null);

const [loading,setLoading] = useState(false);
const [showResults,setShowResults] = useState(true);

const [form,setForm] = useState(
stored?.workingCapital?.form || {
current_assets:"",
current_liabilities:"",
inventory:"",
receivables:"",
annual_sales:"",
cogs:""
}
);

const [result,setResult] = useState(
stored?.workingCapital?.result || null
);


/* FORMAT INR */

const formatINR = (val)=>
new Intl.NumberFormat("en-IN",{
style:"currency",
currency:"INR",
maximumFractionDigits:0
}).format(Math.round(val || 0));


/* SAVE STATE */

useEffect(()=>{

const existing =
JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

localStorage.setItem(
STORAGE_KEY,
JSON.stringify({
...existing,
workingCapital:{form,result}
})
);

},[form,result]);


/* FILE EXTRACTION */

const extractFiles = async () => {

if (!balanceSheet || !profitLoss) {
  alert("Upload Balance Sheet and Profit & Loss");
  return;
}

try {

  setLoading(true);

  const formData = new FormData();

  formData.append("balance_sheet", balanceSheet);
  formData.append("profit_loss", profitLoss);

  const response = await fetch(
    `${API}/wc/parse-and-calculate`,
    {
      method: "POST",
      body: formData
    }
  );

  if (!response.ok) {
    throw new Error("Server error");
  }

  const data = await response.json();

  console.log("Backend Response:", data);

  /* extracted numbers */

  if (data.extracted_values) {

    setForm(prev => ({
      ...prev,
      ...data.extracted_values
    }));

  }

  /* model calculations */

  if (data.calculation) {

    setResult(data.calculation);

  }

  setShowResults(true);

} catch (error) {

  console.error("Extraction error:", error);

  alert("Extraction failed. Check backend logs.");

} finally {

  setLoading(false);

}
};

/* WC MODEL */

const calculate = ()=>{

const ca = Number(form.current_assets || 0);
const cl = Number(form.current_liabilities || 0);
const sales = Number(form.annual_sales || 0);

const nwc = ca - cl;

const current_ratio = cl ? ca/cl : 0;

const wc_turnover = nwc ? sales/nwc : 0;

const mpbf_limit = sales * 0.25;

const turnover_limit = sales * 0.20;

const drawing_power = nwc>0 ? nwc*0.75 : 0;

/* RISK SCORE */

let score = 0;

score += current_ratio>1.5 ? 30 : 15;
score += wc_turnover>3 ? 30 : 15;
score += drawing_power>0 ? 40 : 20;

setResult({
nwc,
current_ratio:Number(current_ratio.toFixed(2)),
wc_turnover:Number(wc_turnover.toFixed(2)),
mpbf_limit,
turnover_limit,
drawing_power,
liquidity_score:score
});

setShowResults(true);

};


const updateField = (key,value)=>{

setForm(prev=>({
...prev,
[key]:value
}));

};


return(

<div className="min-h-screen bg-[#070b14] p-4 sm:p-6 pt-20 pb-32 text-slate-200">

<NavigationButtons prev="/" next="/agriculture"/>


{/* HEADER */}

<div className="flex justify-between items-center mb-8 max-w-7xl mx-auto">

<div className="flex items-center gap-4">

<BarChart3 className="text-blue-500 w-8 h-8"/>

<div>

<h2 className="text-2xl sm:text-3xl font-extrabold text-white">
Working Capital Analysis
</h2>

<p className="text-slate-500 text-sm">
Financial Liquidity & MPBF Model
</p>

</div>

</div>

{result &&(

<button
onClick={()=>setShowResults(!showResults)}
className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-xl"
>

{showResults ? <EyeOff size={18}/> : <Eye size={18}/>}

{showResults ? "Hide Analysis":"Show Analysis"}

</button>

)}

</div>


{/* FILE UPLOAD */}

<div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

<UploadCard
label="Balance Sheet"
icon={<FileText size={20}/>}
onChange={(e)=>setBalanceSheet(e.target.files[0])}
/>

<UploadCard
label="Profit & Loss"
icon={<TrendingUp size={20}/>}
onChange={(e)=>setProfitLoss(e.target.files[0])}
/>

<button
onClick={extractFiles}
disabled={loading}
className="bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl flex items-center justify-center gap-2"
>

<UploadCloud size={20}/>

{loading?"Processing...":"Extract Data"}

</button>

</div>


{/* INPUTS */}

<div className="max-w-7xl mx-auto mt-8 bg-[#0f172a]/40 p-6 sm:p-8 rounded-3xl border border-slate-800">

<h3 className="text-white font-semibold mb-6">
Financial Inputs
</h3>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

<InputField label="Current Assets" value={form.current_assets} onChange={(v)=>updateField("current_assets",v)}/>
<InputField label="Current Liabilities" value={form.current_liabilities} onChange={(v)=>updateField("current_liabilities",v)}/>
<InputField label="Inventory" value={form.inventory} onChange={(v)=>updateField("inventory",v)}/>
<InputField label="Receivables" value={form.receivables} onChange={(v)=>updateField("receivables",v)}/>
<InputField label="Annual Sales" value={form.annual_sales} onChange={(v)=>updateField("annual_sales",v)}/>
<InputField label="COGS" value={form.cogs} onChange={(v)=>updateField("cogs",v)}/>

</div>

<div className="mt-8">

<button
onClick={calculate}
className="bg-white text-slate-900 px-8 py-3 rounded-xl flex items-center gap-2 font-bold"
>

<Calculator size={18}/>
Run Financial Model

</button>

</div>

</div>


{/* RESULTS */}

{result && showResults &&(

<div className="max-w-7xl mx-auto mt-8 space-y-8">


{/* KPI */}

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

<MetricCard title="Net Working Capital" value={formatINR(result.nwc)}/>
<MetricCard title="Current Ratio" value={result.current_ratio}/>
<MetricCard title="WC Turnover" value={result.wc_turnover}/>
<MetricCard title="Drawing Power" value={formatINR(result.drawing_power)}/>

</div>


{/* RISK SCORE */}

<div className="bg-[#0f172a] p-6 rounded-3xl border border-slate-800">

<h3 className="text-white font-semibold mb-3">
Liquidity Risk Score
</h3>

<h2 className="text-3xl font-bold text-emerald-400">
{result.liquidity_score}
</h2>

</div>


{/* CHART */}

<div className="bg-[#0f172a] p-6 rounded-3xl border border-slate-800">

<h3 className="text-white text-sm font-bold mb-6 flex items-center gap-2">

<BarChart3 size={18}/>

Asset Composition

</h3>

<ResponsiveContainer width="100%" height={320}>

<BarChart
data={[
{name:"Assets",value:Number(form.current_assets||0)},
{name:"Liabilities",value:Number(form.current_liabilities||0)},
{name:"NWC",value:result.nwc}
]}
>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="name"/>

<YAxis/>

<Tooltip/>

<Bar dataKey="value">

<Cell fill="#3b82f6"/>
<Cell fill="#ef4444"/>
<Cell fill="#10b981"/>

</Bar>

</BarChart>

</ResponsiveContainer>

</div>


{/* CALCULATION LOGIC */}

<div className="bg-[#0f172a] p-6 rounded-3xl border border-slate-800">

<h3 className="text-white font-semibold mb-4">
Working Capital Model Logic
</h3>

<ul className="text-sm text-slate-300 space-y-2">

<li>NWC = Current Assets − Current Liabilities</li>

<li>Current Ratio = Current Assets ÷ Current Liabilities</li>

<li>WC Turnover = Annual Sales ÷ Net Working Capital</li>

<li>MPBF Limit = 25% of Annual Sales</li>

<li>Turnover Method Limit = 20% of Annual Sales</li>

<li>Drawing Power = Net Working Capital × 75%</li>

<li>Liquidity Score based on Ratio, Turnover and Drawing Power</li>

</ul>

</div>

</div>

)}

</div>

);

}


/* INPUT FIELD */

function InputField({label,value,onChange}){

return(

<div>

<label className="text-xs text-slate-500 uppercase">
{label}
</label>

<input
type="number"
value={value || ""}
onChange={(e)=>onChange(e.target.value)}
className="w-full bg-[#070b14] text-white px-3 py-3 rounded-xl border border-slate-800 mt-1"
/>

</div>

);

}


/* UPLOAD CARD */

function UploadCard({label,icon,onChange}){

return(

<div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800">

<div className="flex items-center gap-2 mb-3 text-slate-400">

{icon}

<span className="text-sm font-semibold">
{label}
</span>

</div>

<input
type="file"
accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.csv"
onChange={onChange}
className="w-full text-xs text-slate-400"
/>

</div>

);

}


/* METRIC CARD */

function MetricCard({title,value}){

return(

<div className="bg-[#0f172a] p-5 rounded-xl border border-slate-800">

<p className="text-slate-400 text-sm">
{title}
</p>

<h2 className="text-xl font-bold mt-2 text-white">
{value}
</h2>

</div>

);

}
