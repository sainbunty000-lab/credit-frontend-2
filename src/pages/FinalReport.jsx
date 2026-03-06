import { loadApp } from "../services/appStorage";

export default function FinalReport(){

const data=loadApp();

return(

<div className="container">

<h2>Final Credit Report</h2>

<p>WC Score: {data.workingCapital?.result?.wc_score}</p>

<p>Agri Score: {data.agriculture?.result?.agri_score}</p>

<p>Banking Score: {data.banking?.analysis?.risk_summary?.hygiene_score}</p>

</div>

)

}
