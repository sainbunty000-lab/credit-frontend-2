import { useState } from "react";
import NavigationButtons from "../components/NavigationButtons";
import { UploadCloud, BarChart3 } from "lucide-react";

import {
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
Cell
} from "recharts";

const API="https://credit-backend-production-d988.up.railway.app";

export default function WorkingCapital(){

const [balanceSheet,setBalanceSheet]=useState(null);
const [profitLoss,setProfitLoss]=useState(null);
const [loading,setLoading]=useState(false);
const [result,setResult]=useState(null);

const formatINR=(v)=>
new Intl.NumberFormat("en-IN",{
style:"currency",
currency:"INR",
maximumFractionDigits:0
}).format(Math.round(v||0));


const extractFiles=async()=>{

if(!balanceSheet||!profitLoss){
alert("Upload Balance Sheet & P&L");
return;
}

try{

setLoading(true);

const fd=new FormData();

fd.append("balance_sheet",balanceSheet);
fd.append("profit_loss",profitLoss);

const res=await fetch(`${API}/wc/upload-dual`,{
method:"POST",
body:fd
});

const data=await res.json();

if(data.success){
setResult(data);
}else{
alert("Extraction failed");
}

}catch(err){

console.error(err);
alert("Server error");

}finally{

setLoading(false);

}

};


return(

<div className="min-h-screen bg-[#070b14] p-4 pt-20 pb-32 text-slate-200">

<NavigationButtons prev="/" next="/agriculture"/>

<div className="max-w-7xl mx-auto space-y-8">

{/* HEADER */}

<div className="flex items-center gap-3">

<BarChart3 className="text-blue-400"/>

<h2 className="text-2xl font-bold">
Working Capital Analysis
</h2>

</div>


{/* FILE UPLOAD */}

<div className="grid sm:grid-cols-2 gap-4">

<input
type="file"
onChange={(e)=>setBalanceSheet(e.target.files[0])}
className="bg-slate-800 p-3 rounded-xl"
/>

<input
type="file"
onChange={(e)=>setProfitLoss(e.target.files[0])}
className="bg-slate-800 p-3 rounded-xl"
/>

<button
onClick={extractFiles}
className="bg-blue-600 px-6 py-3 rounded-xl flex items-center gap-2"
>

<UploadCloud size={18}/>

{loading?"Processing...":"Analyze"}

</button>

</div>


{/* RESULTS */}

{result && (

<div className="space-y-8">

{/* RATIOS */}

<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

<Metric title="NWC" value={formatINR(result.ratios?.nwc)}/>
<Metric title="Current Ratio" value={result.ratios?.current_ratio}/>
<Metric title="Quick Ratio" value={result.ratios?.quick_ratio}/>
<Metric title="Drawing Power" value={formatINR(result.ratios?.drawing_power)}/>

</div>


{/* MPBF */}

<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

<Metric title="GCA" value={formatINR(result.mpbf_analysis?.gca)}/>
<Metric title="WCG" value={formatINR(result.mpbf_analysis?.wcg)}/>
<Metric title="MPBF" value={formatINR(result.mpbf_analysis?.mpbf)}/>
<Metric title="Recommended Limit" value={formatINR(result.mpbf_analysis?.recommended_limit)}/>

</div>


{/* RISK */}

<div className="bg-slate-900 p-6 rounded-xl">

<h3 className="text-lg font-semibold mb-3">
Risk Assessment
</h3>

<p>
Score: {result.risk?.risk_score}
</p>

<p>
Grade: {result.risk?.risk_grade}
</p>

<p>
Status: {result.status}
</p>

</div>


{/* GAP CHART */}

<div className="bg-slate-900 p-6 rounded-xl">

<h3 className="mb-4">
Working Capital Gap
</h3>

<ResponsiveContainer width="100%" height={300}>

<BarChart data={result.charts?.gap_chart||[]}>

<XAxis dataKey="name"/>
<YAxis/>
<Tooltip/>

<Bar dataKey="value">

<Cell fill="#3b82f6"/>
<Cell fill="#ef4444"/>
<Cell fill="#10b981"/>
<Cell fill="#f59e0b"/>

</Bar>

</BarChart>

</ResponsiveContainer>

</div>


{/* ASSET COMPOSITION */}

<div className="bg-slate-900 p-6 rounded-xl">

<h3 className="mb-4">
Asset Composition
</h3>

<ResponsiveContainer width="100%" height={300}>

<BarChart data={result.charts?.composition_chart||[]}>

<XAxis dataKey="name"/>
<YAxis/>
<Tooltip/>

<Bar dataKey="value">

<Cell fill="#10b981"/>
<Cell fill="#3b82f6"/>
<Cell fill="#f59e0b"/>

</Bar>

</BarChart>

</ResponsiveContainer>

</div>

</div>

)}

</div>

</div>

);

}


/* METRIC CARD */

function Metric({title,value}){

return(

<div className="bg-slate-900 p-5 rounded-xl">

<p className="text-sm text-slate-400">
{title}
</p>

<h2 className="text-xl font-bold mt-2">
{value}
</h2>

</div>

);

}
