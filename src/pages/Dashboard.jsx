import { useEffect,useState } from "react";
import MetricCard from "../components/MetricCard";
import { loadApp } from "../services/appStorage";

export default function Dashboard(){

const [data,setData]=useState(null);

useEffect(()=>{

const stored=loadApp();

setData(stored);

},[]);

if(!data) return <p>No Data</p>;

return(

<div className="container">

<h1>Credit Dashboard</h1>

<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"20px"}}>

<MetricCard
title="WC Score"
value={data.workingCapital?.result?.wc_score}
/>

<MetricCard
title="Agri Score"
value={data.agriculture?.result?.agri_score}
/>

<MetricCard
title="Banking Score"
value={data.banking?.analysis?.risk_summary?.hygiene_score}
/>

</div>

</div>

)

}
