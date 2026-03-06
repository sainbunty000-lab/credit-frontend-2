import { loadApp } from "../services/appStorage";

export default function Underwriting(){

  const data = loadApp() || {};

  const wcScore =
    data.workingCapital?.result?.wc_score ?? null;

  const agriScore =
    data.agriculture?.result?.agri_score ?? null;

  const bankingScore =
    data.banking?.result?.risk_summary?.hygiene_score ?? null;

  /* =========================
     DYNAMIC SCORE CALCULATION
  ========================= */

  let score = 0;
  let weightSum = 0;

  if(wcScore !== null){
    score += wcScore * 0.4;
    weightSum += 0.4;
  }

  if(agriScore !== null){
    score += agriScore * 0.3;
    weightSum += 0.3;
  }

  if(bankingScore !== null){
    score += bankingScore * 0.3;
    weightSum += 0.3;
  }

  if(weightSum > 0)
    score = score / weightSum;

  let decision = "DECLINED";

  if(score >= 80)
    decision = "APPROVED";
  else if(score >= 65)
    decision = "CONDITIONAL APPROVAL";

  return(

  <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 space-y-6">

    <h2 className="text-xl font-bold text-emerald-400">
      Underwriting Decision
    </h2>

    <div className="grid grid-cols-3 gap-6">

      {wcScore !== null &&
        <Metric title="Working Capital Score" value={wcScore}/>
      }

      {agriScore !== null &&
        <Metric title="Agriculture Score" value={agriScore}/>
      }

      {bankingScore !== null &&
        <Metric title="Banking Hygiene Score" value={bankingScore}/>
      }

    </div>

    <div className="pt-6 border-t border-slate-800">

      <p className="text-slate-400 text-sm">
        Final Credit Score
      </p>

      <h3 className="text-3xl font-bold text-white">
        {score.toFixed(1)}
      </h3>

      <Decision decision={decision}/>

    </div>

  </div>

  );

}


/* ======================
   METRIC CARD
====================== */

function Metric({title,value}){

  return(

  <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">

    <p className="text-slate-400 text-sm">
      {title}
    </p>

    <h3 className="text-xl font-bold text-white mt-2">
      {value}
    </h3>

  </div>

  );

}


/* ======================
   DECISION BADGE
====================== */

function Decision({decision}){

  let color = "bg-red-500";

  if(decision === "APPROVED")
    color = "bg-emerald-500";

  if(decision === "CONDITIONAL APPROVAL")
    color = "bg-yellow-500";

  return(

  <span className={`${color} px-4 py-2 rounded-md text-black font-semibold mt-3 inline-block`}>
    {decision}
  </span>

  );

}
