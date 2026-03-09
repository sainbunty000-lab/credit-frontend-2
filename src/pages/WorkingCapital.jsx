import { useState } from "react";
import NavigationButtons from "../components/NavigationButtons";

import {
UploadCloud,
Calculator,
BarChart3
} from "lucide-react";

import {
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
Cell
} from "recharts";

const API =
"https://credit-backend-production-d988.up.railway.app";

export default function WorkingCapital(){

const [balanceSheet,setBalanceSheet] = useState(null);
const [profitLoss,setProfitLoss] = useState(null);

const [loading,setLoading] = useState(false);

const [form,setForm] = useState({
current_assets:"",
current_liabilities:"",
inventory:"",
receivables:"",
annual_sales:"",
cogs:""
});

const [result,setResult] = useState(null);


/* FORMAT INR */

const formatINR = (val)=>
new Intl.NumberFormat("en-IN",{
style:"currency",
currency:"INR",
maximumFractionDigits:0
}).format(Math.round(val || 0));


/* =====================================
FILE EXTRACTION
===================================== */

const extractFiles = async ()=>{

if(!balanceSheet || !profitLoss){

alert("Upload Balance Sheet and Profit & Loss");

return;

}

try{

setLoading(true);

const fd = new FormData();

fd.append("balance_sheet",balanceSheet);
fd.append("profit_loss",profitLoss);

const res = await fetch(
`${API}/wc/upload-dual`,
{
method:"POST",
body:fd
}
);

const data = await res.json();

console.log("API RESPONSE",data);

/* Populate form */

setForm({
current_assets:data.current_assets || "",
current_liabilities:data.current_liabilities || "",
inventory:data.inventory || "",
receivables:data.receivables || "",
annual_sales:"",
cogs:""
});

/* Store full result */

setResult(data);

}catch(err){

alert("Extraction failed");

}finally{

setLoading(false);

}

};


/* =====================================
WC CALCULATION (manual override)
===================================== */

const calculate = ()=>{

const ca = Number(form.current_assets || 0);
const cl = Number(form.current_liabilities || 0);
const sales = Number(form.annual_sales || 0);

const nwc = ca - cl;

const current_ratio = cl ? ca/cl : 0;

const wc_turnover = nwc ? sales/nwc : 0;

const drawing_power = nwc>0 ? nwc*0.75 : 0;

setResult({
...result,
nwc,
current_ratio,
wc_turnover,
drawing_power
});

};


/* =====================================
UI
===================================== */

return(

<div className="min-h-screen bg-[#070b14] p-4 sm:p-6 pt-20 pb-32 text-slate-200">

<NavigationButtons prev="/" next="/agriculture"/>

{/* HEADER */}

<div className="flex items-center gap-3 mb-6">

<BarChart3 className="text-blue-500"/>

<h2 className="text-xl font-bold">
Working Capital Analysis
</h2>

</div>


{/* FILE UPLOAD */}

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

<div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800">

<p className="text-sm mb-2">
Balance Sheet
</p>

<input
type="file"
accept=".pdf,.csv,.xls,.xlsx,.jpg,.png"
onChange={(e)=>setBalanceSheet(e.target.files[0])}
/>

</div>


<div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800">

<p className="text-sm mb-2">
Profit & Loss
</p>

<input
type="file"
accept=".pdf,.csv,.xls,.xlsx,.jpg,.png"
onChange={(e)=>setProfitLoss(e.target.files[0])}
/>

</div>


<button
onClick={extractFiles}
className="bg-blue-600 rounded-xl p-4 flex items-center justify-center gap-2"
>

<UploadCloud size={18}/>

{loading ? "Processing..." : "Extract Data"}

</button>

</div>


{/* RESULT */}

{result &&(

<div className="mt-8 space-y-6">

{/* KPI */}

<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

<Metric
label="Current Assets"
value={formatINR(result.current_assets)}
/>

<Metric
label="Current Liabilities"
value={formatINR(result.current_liabilities)}
/>

<Metric
label="Net Working Capital"
value={formatINR(result.nwc)}
/>

<Metric
label="Drawing Power"
value={formatINR(result.drawing_power)}
/>

</div>


{/* RISK */}

<div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800">

<p className="text-sm text-slate-400">
Liquidity Score
</p>

<h2 className="text-2xl font-bold text-emerald-400">

{result.liquidity_score}

</h2>

<p className="text-sm mt-1">

Status: {result.status}

</p>

</div>


{/* CHART */}

<div className="bg-[#0f172a] p-6 rounded-xl border border-slate-800">

<h3 className="text-sm mb-4">
Asset Composition
</h3>

<ResponsiveContainer width="100%" height={300}>

<BarChart
data={[
{name:"Assets",value:result.current_assets},
{name:"Liabilities",value:result.current_liabilities},
{name:"NWC",value:result.nwc}
]}
>

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

</div>

)}

</div>

);

}


/* KPI CARD */

function Metric({label,value}){

return(

<div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800">

<p className="text-xs text-slate-400">
{label}
</p>

<h3 className="text-lg font-bold mt-1">
{value}
</h3>

</div>

);

}
