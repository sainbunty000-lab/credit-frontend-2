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

    const wc = stored.workingCapital?.result || {};
    const agri = stored.agriculture?.result || {};
    const banking = stored.banking?.result || {};

    const wcScore = wc.wc_score || 0;
    const agriScore = agri.agri_score || 0;
    const bankingScore =
      banking.risk_summary?.hygiene_score || 0;

    const finalScore =
      wcScore*0.4 + agriScore*0.3 + bankingScore*0.3;

    let decision = "DECLINED";

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

  const COLORS = ["#10b981","#3b82f6"];

  return(

  <div className="space-y-12">

  {/* SCORE SUMMARY */}

  <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">

    <h2 className="text-xl font-bold text-emerald-400 mb-6">
      Credit Assessment Memorandum
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      <Metric
        title="Working Capital Score"
        value={data.wcScore}
      />

      <Metric
        title="Agriculture Score"
        value={data.agriScore}
      />

      <Metric
        title="Banking Hygiene Score"
        value={data.bankingScore}
      />

    </div>

    <div className="mt-6">

      <h3 className="text-slate-400 text-sm">
        Final Risk Score
      </h3>

      <h2 className="text-3xl font-bold text-white">
        {data.finalScore.toFixed(1)}
      </h2>

      <Decision decision={data.decision}/>

    </div>

  </div>


  {/* WORKING CAPITAL */}

  <div>

  <h2 className="text-emerald-400 font-bold mb-4">
    Working Capital Analysis
  </h2>

  <div className="grid grid-cols-3 gap-6 mb-6">

    <Metric
      title="Current Ratio"
      value={data.wc.current_ratio || 0}
    />

    <Metric
      title="Quick Ratio"
      value={data.wc.quick_ratio || "-"}
    />

    <Metric
      title="Drawing Power"
      value={`₹ ${data.wc.drawing_power?.toLocaleString() || 0}`}
    />

  </div>

  <div className="bg-slate-900 p-6 rounded-xl">

    <ResponsiveContainer width="100%" height={300}>

      <BarChart data={[
        {
          name:"Assets",
          value:data.wc.current_assets || 0
        },
        {
          name:"Liabilities",
          value:data.wc.current_liabilities || 0
        },
        {
          name:"NWC",
          value:data.wc.nwc || 0
        }
      ]}>

        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis dataKey="name"/>
        <YAxis/>
        <Tooltip/>
        <Legend/>

        <Bar dataKey="value" fill="#3b82f6"/>

      </BarChart>

    </ResponsiveContainer>

  </div>

  </div>


  {/* AGRICULTURE */}

  <div>

  <h2 className="text-emerald-400 font-bold mb-4">
    Agriculture Analysis
  </h2>

  <div className="grid grid-cols-3 gap-6 mb-6">

    <Metric
      title="Disposable Income"
      value={`₹ ${data.agri.disposable_income?.toLocaleString() || 0}`}
    />

    <Metric
      title="FOIR %"
      value={`${data.agri.foir_percent || 0}%`}
    />

    <Metric
      title="Eligible Loan"
      value={`₹ ${data.agri.eligible_loan_amount?.toLocaleString() || 0}`}
    />

  </div>

  <div className="bg-slate-900 p-6 rounded-xl">

    <ResponsiveContainer width="100%" height={300}>

      <PieChart>

        <Pie
          data={[
            {
              name:"Documented",
              value:data.agri.chart_data?.income_split?.documented || 0
            },
            {
              name:"Undocumented",
              value:data.agri.chart_data?.income_split?.undocumented || 0
            }
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

  </div>

  </div>


  {/* BANKING */}

  <div>

  <h2 className="text-emerald-400 font-bold mb-4">
    Banking Behaviour
  </h2>

  <div className="grid grid-cols-3 gap-6 mb-6">

    <Metric
      title="Total Credit"
      value={`₹ ${data.banking.statement_summary?.total_credit?.toLocaleString() || 0}`}
    />

    <Metric
      title="Total Debit"
      value={`₹ ${data.banking.statement_summary?.total_debit?.toLocaleString() || 0}`}
    />

    <Metric
      title="Bounce Count"
      value={data.banking.risk_summary?.bounce_count || "-"}
    />

  </div>

  <div className="bg-slate-900 p-6 rounded-xl">

    <ResponsiveContainer width="100%" height={300}>

      <BarChart
        data={data.banking.chart_data?.monthly_trend || []}
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

  </div>

  </div>

  </div>

  );

}


/* METRIC CARD */

function Metric({title,value}){

return(

<div className="bg-slate-900 p-5 rounded-xl border border-slate-800">

<p className="text-slate-400 text-sm">
{title}
</p>

<h2 className="text-xl font-bold text-white mt-2">
{value}
</h2>

</div>

);

}


/* DECISION BADGE */

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
