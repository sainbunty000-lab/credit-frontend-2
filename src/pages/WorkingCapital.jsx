import { useState } from "react";
import { wcUpload } from "../services/api";
import { updateModule } from "../services/appStorage";

export default function WorkingCapital(){

const [bs,setBS]=useState(null);
const [pl,setPL]=useState(null);

const upload=async()=>{

const res=await wcUpload(bs,pl);

updateModule("workingCapital",res.data);

alert("WC Analysis Done");

}

return(

<div className="container">

<h2>Working Capital</h2>

<input type="file" onChange={(e)=>setBS(e.target.files[0])}/>
<input type="file" onChange={(e)=>setPL(e.target.files[0])}/>

<button onClick={upload}>Analyze</button>

</div>

)

}
