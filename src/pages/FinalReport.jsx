import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from "recharts";

const STORAGE_KEY = "credit_app_v1";

export default function FinalReport(){

  const [data,setData] = useState(null);
  const [report,setReport] = useState(null);

  useEffect(()=>{

    const stored =
      JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

    const wc = stored.workingCapital?.result || null;
    const agri = stored.agriculture?.result || null;
    const banking = stored.banking?.result || null;

    const wcScore = wc?.liquidity_score ?? null;
    const agriScore = agri?.risk_score ?? null;
    const bankingScore = banking?.risk_summary?.hygiene_score ?? null;

    /* SCORE ENGINE */

    let score = 0;
    let weight = 0;

    if(wcScore !== null){
      score += wcScore * 0.4;
      weight += 0.4;
    }

    if(agriScore !== null){
      score += agriScore * 0.3;
      weight += 0.3;
    }

    if(bankingScore !== null){
      score += bankingScore * 0.3;
      weight += 0.3;
    }

    if(weight>0) score = score / weight;

    let decision="DECLINED";

    if(score>=80) decision="APPROVED";
    else if(score>=65) decision="CONDITIONAL APPROVAL";

    const recommendedLimit = Math.max(
      wc?.drawing_power || 0,
      agri?.eligible_loan_amount || 0
    );

    setReport({
      id:uuidv4(),
      score,
      decision,
      recommendedLimit
    });

    setData({wc,agri,banking});

  },[]);

  if(!report || !data) return null;

  const COLORS = ["#10b981","#3b82f6"];

  const exportPDF = async()=>{

    const element =
      document.getElementById("cam-report");

    const canvas =
      await html2canvas(element,{scale:2});

    const imgData =
      canvas.toDataURL("image/png");

    const pdf =
      new jsPDF("p","mm","a4");

    const imgWidth=210;
    const imgHeight =
      (canvas.height*imgWidth)/canvas.width;

    pdf.addImage(imgData,"PNG",0,0,imgWidth,imgHeight);

    pdf.save("CAM_Report.pdf");

  };

  return(

  <div className="space-y-10">

  <div
    id="cam-report"
    className="bg-slate-900 p-8 rounded-xl border border-slate-800 space-y-10"
  >

  <h2 className="text-xl font-bold text-emerald-400">
    Credit Assessment Memorandum
  </h2>

  {/* SCORE */}

  <div className="bg-slate-800 p-6 rounded-lg">

    <p className="text-slate-400 text-sm">
      Final Credit Score
    </p>

    <h2 className="text-3xl font-bold text-white">
      {report.score.toFixed(1)}
    </h2>

    <Decision decision={report.decision}/>

  </div>


  {/* WORKING CAPITAL */}

  {data.wc && (

  <Section title="Working Capital Analysis">

  <div className="grid grid-cols-3 gap-6">

  <Metric
    label="Current Ratio"
    value={data.wc.current_ratio}
  />

  <Metric
    label="WC Turnover"
    value={data.wc.wc_turnover}
  />

  <Metric
    label="Drawing Power"
    value={`₹ ${data.wc.drawing_power?.toLocaleString()}`}
  />

  </div>

  <ChartCard>

  <ResponsiveContainer width="100%" height={280}>

  <BarChart data={[
    {name:"Assets",value:data.wc.current_assets||0},
    {name:"Liabilities",value:data.wc.current_liabilities||0},
    {name:"NWC",value:data.wc.nwc||0}
  ]}>

  <CartesianGrid strokeDasharray="3 3"/>
  <XAxis dataKey="name"/>
  <YAxis/>
  <Tooltip/>
  <Legend/>

  <Bar dataKey="value" fill="#3b82f6"/>

  </BarChart>

  </ResponsiveContainer>

  </ChartCard>

  </Section>

  )}


  {/* AGRICULTURE */}

  {data.agri && (

  <Section title="Agriculture Analysis">

  <div className="grid grid-cols-3 gap-6">

  <Metric
    label="Disposable Income"
    value={`₹ ${data.agri.disposable_income?.toLocaleString()}`}
  />

  <Metric
    label="FOIR %"
    value={`${data.agri.foir_percent}%`}
  />

  <Metric
    label="Eligible Loan"
    value={`₹ ${data.agri.eligible_loan_amount?.toLocaleString()}`}
  />

  </div>

  <ChartCard>

  <ResponsiveContainer width="100%" height={280}>

  <PieChart>

  <Pie
    data={[
      {
        name:"Documented",
        value:data.agri.chart_data?.income_split?.documented||0
      },
      {
        name:"Undocumented",
        value:data.agri.chart_data?.income_split?.undocumented||0
      }
    ]}
    dataKey="value"
    outerRadius={110}
  >

  {COLORS.map((c,i)=>(
    <Cell key={i} fill={c}/>
  ))}

  </Pie>

  <Tooltip/>

  </PieChart>

  </ResponsiveContainer>

  </ChartCard>

  </Section>

  )}


  {/* BANKING */}

  {data.banking && (

  <Section title="Banking Behaviour">

  <div className="grid grid-cols-3 gap-6">

  <Metric
    label="Total Credit"
    value={`₹ ${data.banking.statement_summary?.total_credit?.toLocaleString()}`}
  />

  <Metric
    label="Total Debit"
    value={`₹ ${data.banking.statement_summary?.total_debit?.toLocaleString()}`}
  />

  <Metric
    label="Bounce Count"
    value={data.banking.behavior_analysis?.bounce_count||0}
  />

  </div>

  <ChartCard>

  <ResponsiveContainer width="100%" height={280}>

  <BarChart
    data={data.banking.chart_data?.monthly_trend||[]}
  >

  <CartesianGrid strokeDasharray="3 3"/>
  <XAxis dataKey="month"/>
  <YAxis/>
  <Tooltip/>
  <Legend/>

  <Bar dataKey="credit" fill="#3b82f6"/>
  <Bar dataKey="debit" fill="#ef4444"/>

  </BarChart>

  </ResponsiveContainer>

  </ChartCard>

  </Section>

  )}

  {/* LIMIT */}

  <div className="bg-slate-800 p-6 rounded-lg">

  <p className="text-slate-400 text-sm">
  Recommended Credit Limit
  </p>

  <h2 className="text-3xl font-bold text-emerald-400">
  ₹ {report.recommendedLimit.toLocaleString()}
  </h2>

  </div>

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


/* COMPONENTS */

function Metric({label,value}){

return(

<div className="bg-slate-800 p-4 rounded-lg">

<p className="text-xs text-slate-400">
{label}
</p>

<h3 className="text-lg font-bold text-white mt-1">
{value}
</h3>

</div>

);

}

function Decision({decision}){

let color="bg-red-500";

if(decision==="APPROVED") color="bg-emerald-500";
if(decision==="CONDITIONAL APPROVAL") color="bg-yellow-500";

return(
<span className={`${color} px-4 py-2 rounded-md text-black font-semibold mt-3 inline-block`}>
{decision}
</span>
);

}

function Section({title,children}){

return(

<div className="space-y-6">

<h3 className="text-lg font-semibold text-emerald-400">
{title}
</h3>

{children}

</div>

);

}

function ChartCard({children}){

return(

<div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
{children}
</div>

);

}
