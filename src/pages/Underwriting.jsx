import { loadApp } from "../services/appStorage";

export default function Underwriting(){

const data=loadApp();

const wc=data.workingCapital?.result?.wc_score || 0;
const agri=data.agriculture?.result?.agri_score || 0;
const bank=data.banking?.analysis?.risk_summary?.hygiene_score || 0;

const score=(wc*0.4)+(agri*0.3)+(bank*0.3);

let decision="DECLINED";

if(score>=80) decision="APPROVED";
else if(score>=65) decision="CONDITIONAL";

return(

<div className="container">

<h2>Underwriting Decision</h2>

<p>Final Score: {score}</p>

<p>Decision: {decision}</p>

</div>

)

}
