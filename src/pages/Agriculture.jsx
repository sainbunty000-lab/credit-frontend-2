import { useState, useEffect } from "react";
import NavigationButtons from "../components/NavigationButtons";
import LOSProgress from "../components/LOSProgress";
import ExportCAM from "../components/ExportCAM";

import {
  Leaf,
  CheckCircle2,
  XCircle
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

import { agriCalculate } from "../services/api";
import { STORAGE_KEY } from "../config/constants";
import { handleApiError } from "../utils/errorHandler";

const COLORS = ["#10b981","#3b82f6"];

export default function Agriculture(){

const [form,setForm] = useState({
documented_income:"",
tax:"",
undocumented_income_monthly:"",
emi_monthly:""
});

const [result,setResult] = useState(null);
const [loading,setLoading] = useState(false);
const [error,setError] = useState("");

/* LOAD STORAGE */

useEffect(()=>{

try{

const stored =
JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

if(stored.agriculture){

setForm(stored.agriculture.form || form);
setResult(stored.agriculture.result || null);

}

}catch{
console.log("Storage load failed");
}

},[]);


/* SAVE STORAGE */

useEffect(()=>{

try{

const existing =
JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

localStorage.setItem(
STORAGE_KEY,
JSON.stringify({
...existing,
agriculture:{form,result}
})
);

}catch{
console.log("Storage save failed");
}

},[form,result]);


/* FORMAT INR */

const formatINR = (val)=>
new Intl.NumberFormat("en-IN",{
style:"currency",
currency:"INR",
maximumFractionDigits:0
}).format(Math.round(val || 0));


/* INPUT CHANGE */

const handleChange=(e)=>{

const {name,value}=e.target;

setForm(prev=>({
...prev,
[name]:value
}));

};


/* CALCULATE */

const handleSubmit = async ()=>{

setError("");
setLoading(true);

try{

const response = await agriCalculate({
documented_income:Number(form.documented_income || 0),
tax:Number(form.tax || 0),
undocumented_income_monthly:Number(form.undocumented_income_monthly || 0),
emi_monthly:Number(form.emi_monthly || 0)
});

const data = response?.data || response || {};

const disposableIncome = Number(data.disposable_income || 0);
const emi = Number(form.emi_monthly || 0);

const foir =
disposableIncome>0
? Number(((emi/disposableIncome)*100).toFixed(2))
:0;

data.foir_percent = foir;

setResult(data);

}catch(err){

setError(handleApiError(err,"Unable to calculate agriculture eligibility."));

}finally{

setLoading(false);

}

};


/* CHART DATA */

const incomePie = [
{name:"Documented",value:Number(form.documented_income||0)},
{name:"Undocumented",value:Number(form.undocumented_income_monthly||0)}
];

const loanChart = result ? [
{name:"Disposable Income",value:result.disposable_income},
{name:"Eligible Loan",value:result.eligible_loan_amount}
]:[];

return(

<div className="min-h-screen bg-[#070b14] p-4 sm:p-6 pt-20 pb-32 text-slate-200">

<NavigationButtons
prev="/working-capital"
next="/banking"
/>

<LOSProgress/>

<div className="max-w-7xl mx-auto space-y-8">

{/* HEADER */}

<div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex justify-between items-center">

<div className="flex items-center gap-4">

<div className="p-3 bg-emerald-500/10 rounded-xl">
<Leaf className="text-emerald-500 w-7 h-7"/>
</div>

<div>
<h2 className="text-xl font-bold">
Agriculture Credit Intelligence
</h2>

<p className="text-xs text-slate-400 uppercase">
Dual Model Underwriting
</p>
</div>

</div>

{result &&(

<div className={`px-4 py-2 rounded-lg border text-sm flex items-center gap-2 ${
result.status==="Rejected"
?"border-red-500 text-red-500"
:"border-emerald-500 text-emerald-500"
}`}>

{result.status==="Rejected"
?<XCircle size={16}/>
:<CheckCircle2 size={16}/>}

{result.status || "Approved"}

</div>

)}

</div>

{/* INPUT */}

<div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

<Input label="Documented Income"
name="documented_income"
value={form.documented_income}
onChange={handleChange}/>

<Input label="Taxes Paid"
name="tax"
value={form.tax}
onChange={handleChange}/>

<Input label="Monthly Informal Income"
name="undocumented_income_monthly"
value={form.undocumented_income_monthly}
onChange={handleChange}/>

<Input label="Current EMI"
name="emi_monthly"
value={form.emi_monthly}
onChange={handleChange}/>

</div>

<button
onClick={handleSubmit}
disabled={loading}
className="mt-6 bg-emerald-600 hover:bg-emerald-500 px-8 py-3 rounded-xl font-semibold"
>

{loading?"Computing...":"Run Agriculture Analysis"}

</button>

</div>

{error &&(
<p className="text-red-500 text-sm">{error}</p>
)}

{/* RESULT */}

{result &&(

<div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">

<h3 className="text-lg font-bold">
Agriculture Result
</h3>

<p>Total Adjusted Income: {formatINR(result.total_adjusted_income)}</p>

<p>Disposable Income: {formatINR(result.disposable_income)}</p>

<p>Eligible Loan Amount: {formatINR(result.eligible_loan_amount)}</p>

<p>FOIR: {result.foir_percent}%</p>

<p>Risk Grade: {result.risk_grade || "-"}</p>

</div>

)}

{/* RISK INDICATOR */}

{result &&(

<div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">

<h3 className="font-semibold mb-4">
Risk Indicator
</h3>

<div className={`px-6 py-3 rounded-lg text-lg font-bold inline-block
${result.risk_grade==="A"?"bg-emerald-500 text-black":""}
${result.risk_grade==="B"?"bg-yellow-500 text-black":""}
${result.risk_grade==="C"?"bg-orange-500 text-black":""}
${result.risk_grade==="D"?"bg-red-500 text-white":""}
`}>

Risk Grade : {result.risk_grade}

</div>

</div>

)}

{/* FOIR GAUGE */}

{result &&(

<div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">

<h3 className="font-semibold mb-4">
FOIR Risk Level
</h3>

<div className="w-full bg-slate-700 h-4 rounded-full">

<div
className={`h-4 rounded-full
${result.foir_percent<30?"bg-emerald-500":""}
${result.foir_percent>=30 && result.foir_percent<50?"bg-yellow-500":""}
${result.foir_percent>=50?"bg-red-500":""}
`}
style={{width:`${result.foir_percent}%`}}
/>

</div>

<p className="text-sm mt-2">
FOIR : {result.foir_percent}%
</p>

</div>

)}

{/* CHARTS */}

{result &&(

<div className="grid md:grid-cols-2 gap-6">

<div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">

<h3 className="font-semibold mb-4">
Income Split
</h3>

<ResponsiveContainer width="100%" height={250}>

<PieChart>

<Pie
data={incomePie}
dataKey="value"
outerRadius={90}
>

{COLORS.map((c,i)=>(
<Cell key={i} fill={c}/>
))}

</Pie>

<Tooltip/>

</PieChart>

</ResponsiveContainer>

</div>

<div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">

<h3 className="font-semibold mb-4">
Loan Eligibility
</h3>

<ResponsiveContainer width="100%" height={250}>

<BarChart data={loanChart}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="name"/>

<YAxis/>

<Tooltip/>

<Bar dataKey="value" fill="#3b82f6"/>

</BarChart>

</ResponsiveContainer>

</div>

</div>

)}

</div>

<ExportCAM/>

</div>

);

}


/* INPUT */

function Input({label,name,value,onChange}){

return(

<div>

<p className="text-xs text-slate-400 mb-1">
{label}
</p>

<input
type="number"
name={name}
value={value}
onChange={onChange}
className="w-full bg-slate-800 border border-slate-700 p-2 rounded-lg"
/>

</div>

);

}
