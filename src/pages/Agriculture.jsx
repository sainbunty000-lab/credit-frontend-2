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

const STORAGE_KEY = "credit_app_v1";

export default function Agriculture() {

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

}catch(e){
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

console.error(err);
setError("Unable to calculate agriculture eligibility.");

}finally{

setLoading(false);

}

};

return(

<div className="min-h-screen bg-[#070b14] p-4 sm:p-6 pt-20 pb-24 text-slate-200">

{/* NAVIGATION */}

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

{/* INPUT SECTION */}

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

</div>

<ExportCAM/>

</div>

);

}

/* INPUT COMPONENT */

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
