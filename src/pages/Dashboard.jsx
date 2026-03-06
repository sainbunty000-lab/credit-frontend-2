import { useEffect, useState } from "react";

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

export default function Dashboard() {

  const [data,setData] = useState(null);

  useEffect(()=>{

    const stored =
      JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

    const wc = stored.workingCapital?.result || null;
    const agri = stored.agriculture?.result || null;
    const banking = stored.banking?.result || null;

    const wcScore = wc?.wc_score ?? null;
    const agriScore = agri?.agri_score ?? null;
    const bankingScore = banking?.risk_summary?.hygiene_score ?? null;

    /* ===========================
       DYNAMIC SCORE CALCULATION
    ============================ */

    let finalScore = 0;
    let weightSum = 0;

    if(wcScore !== null){
      finalScore += wcScore * 0.4;
      weightSum += 0.4;
    }

    if(agriScore !== null){
      finalScore += agriScore * 0.3;
      weightSum += 0.3;
    }

    if(bankingScore !== null){
      finalScore += bankingScore * 0.3;
      weightSum += 0.3;
    }

    if(weightSum > 0)
      finalScore = finalScore / weightSum;

    let decision="DECLINED";

    if(finalScore >= 80) decision="APPROVED";
    else if(finalScore >=65) decision="CONDITIONAL";

    setData({
      wc,
      agri,
      banking,
      wcScore,
      agriScore,
      bankingScore,
      finalScore,
      decision
    });

  },[]);


  if(!data) return null;

  const COLORS=["#10b981","#3b82f6"];

  return(

  <div className="space-y-12">

  {/* ==============================
      CREDIT SUMMARY
  ============================== */}

  <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">

    <h2 className="text-xl font-bold text-emerald-400 mb-6">
      Credit Assessment Memorandum
    </h2>

    <div className="grid grid-cols-3 gap-6">

      {data.wcScore !== null &&
        <Metric title="Working Capital Score" value={data.wcScore}/>
      }

      {data.agriScore !== null &&
        <Metric title="Agriculture Score" value={data.agriScore}/>
      }

      {data.bankingScore !== null &&
        <Metric title="Banking Hygiene Score" value={data.bankingScore}/>
      }

    </div>

    <div className="mt-6">

      <p className="text-slate-400 text-sm">
        Final Risk Score
      </p>

      <h2 className="text-3xl font-bold text-white">
        {data.finalScore ? data.finalScore.toFixed(1) : "0"}
      </h2>

      <Decision decision={data.decision}/>

    </div>

  </div>


  {/* ==============================
      WORKING CAPITAL
  ============================== */}

  {data.wc && (

  <Section title="Working Capital Analysis">

    <div className="grid grid-cols-3 gap-6 mb-6">

      <Metric title="Current Ratio" value={data.wc.current_ratio ?? 0}/>
      <Metric title="Quick Ratio" value={data.wc.quick_ratio ?? "-"}/>
      <Metric title="Drawing Power" value={`₹ ${(data.wc.drawing_power ?? 0).toLocaleString()}`}/>

    </div>

    <ChartCard>

      <ResponsiveContainer width="100%" height={300}>

        <BarChart data={[
          {name:"Assets",value:data.wc.current_assets ?? 0},
          {name:"Liabilities",value:data.wc.current_liabilities ?? 0},
          {name:"NWC",value:data.wc.nwc ?? 0}
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


  {/* ==============================
      AGRICULTURE
  ============================== */}

  {data.agri && (

  <Section title="Agriculture Analysis">

    <div className="grid grid-cols-3 gap-6 mb-6">

      <Metric title="Disposable Income" value={`₹ ${(data.agri.disposable_income ?? 0).toLocaleString()}`}/>
      <Metric title="FOIR %" value={`${data.agri.foir_percent ?? 0}%`}/>
      <Metric title="Eligible Loan" value={`₹ ${(data.agri.eligible_loan_amount ?? 0).toLocaleString()}`}/>

    </div>

    <ChartCard>

      <ResponsiveContainer width="100%" height={300}>

        <PieChart>

          <Pie
            data={[
              {name:"Documented",value:data.agri.chart_data?.income_split?.documented ?? 0},
              {name:"Undocumented",value:data.agri.chart_data?.income_split?.undocumented ?? 0}
            ]}
            outerRadius={120}
            dataKey="value"
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


  {/* ==============================
      BANKING
  ============================== */}

  {data.banking && (

  <Section title="Banking Behaviour">

    <div className="grid grid-cols-3 gap-6 mb-6">

      <Metric
        title="Total Credit"
        value={`₹ ${(data.banking.statement_summary?.total_credit ?? 0).toLocaleString()}`}
      />

      <Metric
        title="Total Debit"
        value={`₹ ${(data.banking.statement_summary?.total_debit ?? 0).toLocaleString()}`}
      />

      <Metric
        title="Bounce Count"
        value={data.banking.behavior_analysis?.bounce_count ?? 0}
      />

    </div>

    <ChartCard>

      <ResponsiveContainer width="100%" height={300}>

        <BarChart data={data.banking.chart_data?.monthly_trend ?? []}>

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

  </div>

  );

}


/* COMPONENTS */

function Metric({title,value}){

return(

<div className="bg-slate-900 p-5 rounded-xl border border-slate-800">

<p className="text-slate-400 text-sm">{title}</p>

<h2 className="text-xl font-bold text-white mt-2">{value}</h2>

</div>

);

}

function Decision({decision}){

let color="bg-red-500";

if(decision==="APPROVED") color="bg-emerald-500";
if(decision==="CONDITIONAL") color="bg-yellow-500";

return(
<span className={`${color} px-4 py-2 rounded-md text-black font-semibold mt-3 inline-block`}>
{decision}
</span>
);

}

function Section({title,children}){

return(

<div>

<h2 className="text-emerald-400 font-bold mb-4">
{title}
</h2>

{children}

</div>

);

}

function ChartCard({children}){

return(

<div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
{children}
</div>

);

}
