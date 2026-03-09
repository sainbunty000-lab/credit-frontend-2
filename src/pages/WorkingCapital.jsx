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


/* SAVE STORAGE */

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


/* ===============================
FILE EXTRACTION
================================ */

const extractFiles = async ()=>{

if(!balanceSheet || !profitLoss){

alert("Upload Balance Sheet and Profit & Loss");

return;

}

try{

setLoading(true);

const fd = new FormData();

/* backend expected fields */

fd.append("balance_sheet",balanceSheet);
fd.append("profit_loss",profitLoss);

const res = await fetch(`${API}/wc/upload-dual`,{
method:"POST",
body:fd
});

if(!res.ok){

throw new Error("Server error");

}

const data = await res.json();

console.log("Extraction Response:",data);

if(data?.extracted_values){

setForm(prev=>({
...prev,
...data.extracted_values
}));

}

if(data?.calculations){

setResult(data.calculations);

}

setShowResults(true);

}catch(err){

console.error(err);

alert("Extraction failed. Please check backend API.");

}finally{

setLoading(false);

}

};


/* ===============================
WORKING CAPITAL MODEL
================================ */

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


/* LIQUIDITY SCORE */

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


/* ===============================
UI
================================ */

return(

<div className="min-h-screen bg-[#070b14] p-4 sm:p-6 pt-16 pb-28 text-slate-200">

<NavigationButtons prev="/" next="/agriculture"/>


{/* HEADER */}

<div className="flex justify-between items-center mb-6 max-w-7xl mx-auto">

<div className="flex items-center gap-3">

<BarChart3 className="text-blue-500 w-6 h-6"/>

<div>

<h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white">
Working Capital Analysis
</h2>

<p className="text-xs text-slate-400">
Financial Liquidity & MPBF Model
</p>

</div>

</div>

{result &&(

<button
onClick={()=>setShowResults(!showResults)}
className="flex items-center gap-2 bg-slate-800 px-3 py-2 rounded-lg text-sm"
>

{showResults ? <EyeOff size={16}/> : <Eye size={16}/>}

{showResults ? "Hide":"Show"}

</button>

)}

</div>


{/* FILE UPLOAD */}

<div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

<UploadCard
label="Balance Sheet"
icon={<FileText size={18}/>}
onChange={(e)=>setBalanceSheet(e.target.files[0])}
/>

<UploadCard
label="Profit & Loss"
icon={<TrendingUp size={18}/>}
onChange={(e)=>setProfitLoss(e.target.files[0])}
/>

<button
onClick={extractFiles}
disabled={loading}
className="bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl flex items-center justify-center gap-2"
>

<UploadCloud size={18}/>

{loading ? "Processing..." : "Extract Data"}

</button>

</div>


{/* INPUTS */}

<div className="max-w-7xl mx-auto mt-6 bg-[#0f172a]/40 p-5 rounded-2xl border border-slate-800">

<h3 className="text-sm font-semibold mb-4 text-white">
Financial Inputs
</h3>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

<InputField label="Current Assets" value={form.current_assets} onChange={(v)=>updateField("current_assets",v)}/>
<InputField label="Current Liabilities" value={form.current_liabilities} onChange={(v)=>updateField("current_liabilities",v)}/>
<InputField label="Inventory" value={form.inventory} onChange={(v)=>updateField("inventory",v)}/>
<InputField label="Receivables" value={form.receivables} onChange={(v)=>updateField("receivables",v)}/>
<InputField label="Annual Sales" value={form.annual_sales} onChange={(v)=>updateField("annual_sales",v)}/>
<InputField label="COGS" value={form.cogs} onChange={(v)=>updateField("cogs",v)}/>

</div>

<button
onClick={calculate}
className="mt-5 bg-white text-slate-900 px-6 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold"
>

<Calculator size={16}/>
Run Financial Model

</button>

</div>


{/* RESULTS */}

{result && showResults &&(

<div className="max-w-7xl mx-auto mt-6 space-y-6">


{/* KPI */}

<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">

<MetricCard title="Net Working Capital" value={formatINR(result.nwc)}/>
<MetricCard title="Current Ratio" value={result.current_ratio}/>
<MetricCard title="WC Turnover" value={result.wc_turnover}/>
<MetricCard title="Drawing Power" value={formatINR(result.drawing_power)}/>

</div>


{/* LIQUIDITY SCORE */}

<div className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800">

<p className="text-xs text-slate-400 mb-1">
Liquidity Risk Score
</p>

<h2 className="text-2xl font-bold text-emerald-400">
{result.liquidity_score}
</h2>

</div>


{/* CHART */}

<div className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800">

<h3 className="text-xs font-semibold mb-3 text-white flex items-center gap-2">

<BarChart3 size={16}/>
Asset Composition

</h3>

<ResponsiveContainer width="100%" height={260}>

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

<div className="bg-[#0f172a] p-5 rounded-2xl border border-slate-800">

<h3 className="text-sm font-semibold mb-3 text-white">
Model Calculation Logic
</h3>

<ul className="text-xs text-slate-300 space-y-1">

<li>NWC = Current Assets − Current Liabilities</li>
<li>Current Ratio = Current Assets ÷ Current Liabilities</li>
<li>WC Turnover = Annual Sales ÷ Net Working Capital</li>
<li>MPBF Limit = 25% of Annual Sales</li>
<li>Turnover Limit = 20% of Annual Sales</li>
<li>Drawing Power = NWC × 75%</li>

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

<label className="text-xs text-slate-400">
{label}
</label>

<input
type="number"
value={value || ""}
onChange={(e)=>onChange(e.target.value)}
className="w-full bg-[#070b14] text-white px-3 py-2 rounded-lg border border-slate-800 mt-1 text-sm"
/>

</div>

);

}


/* UPLOAD CARD */

function UploadCard({label,icon,onChange}){

return(

<div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800">

<div className="flex items-center gap-2 mb-2 text-slate-400">

{icon}

<span className="text-xs font-semibold">
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

<div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800">

<p className="text-xs text-slate-400">
{title}
</p>

<h2 className="text-lg font-bold mt-1 text-white">
{value}
</h2>

</div>

);

}
