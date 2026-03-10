import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useEffect,useState } from "react";

const STORAGE_KEY="credit_app_v1";

export default function FinalReport(){

const [data,setData]=useState(null);

useEffect(()=>{

const stored=JSON.parse(localStorage.getItem(STORAGE_KEY))||{};

setData({
wc:stored.workingCapital?.result||null,
agri:stored.agriculture?.result||null,
banking:stored.banking?.result||null
});

},[]);

if(!data) return null;

const wc=data.wc;
const agri=data.agri;
const banking=data.banking;


/* CREDIT SCORE */

let score=0;
let weight=0;

if(wc?.risk?.risk_score){
score+=wc.risk.risk_score*0.4;
weight+=0.4;
}

if(agri?.risk_score){
score+=agri.risk_score*0.3;
weight+=0.3;
}

if(banking?.risk_summary?.hygiene_score){
score+=banking.risk_summary.hygiene_score*0.3;
weight+=0.3;
}

if(weight>0) score=score/weight;

let decision="DECLINED";

if(score>=80) decision="APPROVED";
else if(score>=65) decision="CONDITIONAL APPROVAL";


const recommendedLimit=Math.max(

wc?.mpbf_analysis?.recommended_limit||0,
agri?.eligible_loan_amount||0

);


/* EXPORT PDF */

const exportPDF=async()=>{

const element=document.getElementById("cam-report");

const canvas=await html2canvas(element,{scale:2});

const imgData=canvas.toDataURL("image/png");

const pdf=new jsPDF("p","mm","a4");

const imgWidth=210;
const pageHeight=295;

const imgHeight=(canvas.height*imgWidth)/canvas.width;

let heightLeft=imgHeight;
let position=0;

pdf.addImage(imgData,"PNG",0,position,imgWidth,imgHeight);

heightLeft-=pageHeight;

while(heightLeft>=0){

position=heightLeft-imgHeight;

pdf.addPage();

pdf.addImage(imgData,"PNG",0,position,imgWidth,imgHeight);

heightLeft-=pageHeight;

}

pdf.save("CAM_Report.pdf");

};


return(

<div className="p-4 sm:p-6 space-y-10">

<div id="cam-report" className="bg-slate-900 p-6 rounded-xl space-y-10">


{/* SECTION 1 */}

<section>

<h2 className="text-xl font-bold text-emerald-400">
Executive Credit Summary
</h2>

<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">

<Card title="Credit Score" value={score.toFixed(1)}/>
<Card title="Decision" value={decision}/>
<Card title="Recommended Limit" value={`₹ ${recommendedLimit.toLocaleString()}`}/>
<Card title="Model" value="AI Underwriting"/>

</div>

</section>


{/* SECTION 2 */}

<section>

<h2 className="text-lg font-semibold text-emerald-400">
Borrower Profile
</h2>

<p className="text-slate-300 text-sm mt-2">

Applicant evaluated using automated credit underwriting engine
combining financial statements, agricultural income and banking
transaction behaviour.

</p>

</section>


{/* SECTION 3 */}

{wc && (

<section>

<h2 className="text-lg font-semibold text-emerald-400">
Working Capital Assessment
</h2>

<div className="grid md:grid-cols-3 gap-4 mt-4">

<Card title="Current Ratio" value={wc?.ratios?.current_ratio}/>
<Card title="WC Turnover" value={wc?.ratios?.wc_turnover}/>
<Card title="Drawing Power" value={`₹ ${wc?.ratios?.drawing_power?.toLocaleString()}`}/>

</div>

<div className="bg-slate-800 p-4 rounded-lg mt-6 text-sm text-slate-300">

<b>Working Capital Model Logic</b>

<ul className="mt-2 space-y-1">

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

</section>

)}


{/* SECTION 4 */}

{agri && (

<section>

<h2 className="text-lg font-semibold text-emerald-400">
Agriculture Income Assessment
</h2>

<div className="grid md:grid-cols-3 gap-4 mt-4">

<Card title="Disposable Income" value={`₹ ${agri?.disposable_income?.toLocaleString()}`}/>
<Card title="FOIR %" value={`${agri?.foir_percent}%`}/>
<Card title="Eligible Loan" value={`₹ ${agri?.eligible_loan_amount?.toLocaleString()}`}/>

</div>

</section>

)}


{/* SECTION 5 */}

{banking && (

<section>

<h2 className="text-lg font-semibold text-emerald-400">
Banking Behaviour Analysis
</h2>

<div className="grid md:grid-cols-3 gap-4 mt-4">

<Card title="Total Credit" value={`₹ ${banking?.statement_summary?.total_credit?.toLocaleString()}`}/>
<Card title="Total Debit" value={`₹ ${banking?.statement_summary?.total_debit?.toLocaleString()}`}/>
<Card title="Bounce Count" value={banking?.behavior_analysis?.bounce_count}/>

</div>

</section>

)}


{/* SECTION 6 */}

<section>

<h2 className="text-lg font-semibold text-emerald-400">
Risk Assessment
</h2>

<p className="text-slate-300 text-sm mt-2">

Credit score derived from integrated financial model combining
working capital ratios, agricultural income stability and banking
transaction hygiene.

</p>

</section>


{/* SECTION 7 */}

<section>

<h2 className="text-lg font-semibold text-emerald-400">
Final Credit Recommendation
</h2>

<div className="bg-slate-800 p-6 rounded-lg mt-4">

<p className="text-slate-400 text-sm">
Recommended Credit Limit
</p>

<h2 className="text-3xl font-bold text-emerald-400">
₹ {recommendedLimit.toLocaleString()}
</h2>

<p className="text-sm text-slate-300 mt-2">

Decision: <b>{decision}</b>

</p>

</div>

</section>


</div>


<button
onClick={exportPDF}
className="bg-emerald-500 px-6 py-3 rounded-md text-black font-semibold"
>

Export CAM Report PDF

</button>

</div>

);

}


function Card({title,value}){

return(

<div className="bg-slate-800 p-4 rounded-lg">

<p className="text-xs text-slate-400">
{title}
</p>

<h3 className="text-lg font-bold text-white mt-1">
{value}
</h3>

</div>

);

}
