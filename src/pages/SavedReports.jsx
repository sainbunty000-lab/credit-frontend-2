import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SavedReports(){

 const [reports,setReports] = useState([]);
 const navigate = useNavigate();

 useEffect(()=>{

   const stored =
     JSON.parse(localStorage.getItem("cam_reports") || "[]");

   setReports(stored);

 },[]);


 const openReport = (report)=>{

   localStorage.setItem(
     "credit_app_v1",
     JSON.stringify(report.data)
   );

   navigate("/working-capital");

 };


 return(

 <div className="p-6 text-white">

 <h2 className="text-2xl mb-6">
 Saved CAM Reports
 </h2>

 {reports.length===0 && (
   <p>No reports saved yet</p>
 )}

 {reports.map((r)=>(

 <div
 key={r.id}
 onClick={()=>openReport(r)}
 className="bg-slate-800 p-4 mb-4 rounded cursor-pointer hover:bg-slate-700"
 >

 <h3 className="text-lg">
 {r.name}
 </h3>

 <p className="text-sm text-gray-400">
 {r.date}
 </p>

 </div>

 ))}

 </div>

 )

}
