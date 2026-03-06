import { useState } from "react";
import { bankingAnalyze } from "../services/api";
import { updateModule } from "../services/appStorage";

export default function Banking(){

const [file,setFile]=useState(null);

const analyze=async()=>{

const res=await bankingAnalyze(file);

updateModule("banking",res.data);

alert("Banking Analysis Done");

}

return(

<div className="container">

<h2>Banking Analysis</h2>

<input type="file" onChange={(e)=>setFile(e.target.files[0])}/>

<button onClick={analyze}>Analyze</button>

</div>

)

}
