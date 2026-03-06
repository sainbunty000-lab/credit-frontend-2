import { useState } from "react";
import { agriCalculate } from "../services/api";
import { updateModule } from "../services/appStorage";

export default function Agriculture(){

const [income,setIncome]=useState("");

const run=async()=>{

const res=await agriCalculate({

documented_income:income,
tax:0,
undocumented_income_monthly:0,
emi_monthly:0

});

updateModule("agriculture",res.data);

alert("Agri Analysis Done");

}

return(

<div className="container">

<h2>Agriculture</h2>

<input
placeholder="Documented Income"
onChange={(e)=>setIncome(e.target.value)}
/>

<button onClick={run}>Calculate</button>

</div>

)

}
