import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationButtons from "../components/NavigationButtons";

const CAM_STORAGE = "cam_reports";
const STORAGE_KEY = "credit_app_v1";

export default function SavedReports(){

  const [reports,setReports] = useState([]);
  const navigate = useNavigate();

  useEffect(()=>{

    const stored =
      JSON.parse(localStorage.getItem(CAM_STORAGE) || "[]");

    setReports(stored);

  },[]);


  /* OPEN SAVED REPORT */

  const openReport = (report)=>{

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(report.data)
    );

    navigate("/working-capital");

  };


  /* DELETE REPORT */

  const deleteReport = (id)=>{

    const existing =
      JSON.parse(localStorage.getItem(CAM_STORAGE) || "[]");

    const updated =
      existing.filter(r => r.id !== id);

    localStorage.setItem(
      CAM_STORAGE,
      JSON.stringify(updated)
    );

    setReports(updated);

  };


  return(

  <div className="p-6 pt-20 pb-28 text-white min-h-screen bg-slate-950">

  {/* Back to Home Button */}
  <NavigationButtons prev="/" backHome />

  <h2 className="text-2xl font-bold mb-6">
  Saved CAM Reports
  </h2>


  {reports.length===0 && (

  <p className="text-gray-400">
  No CAM reports saved yet
  </p>

  )}


  <div className="space-y-4">

  {reports.map((r)=>(

  <div
    key={r.id}
    className="bg-slate-900 p-5 rounded-lg border border-slate-800"
  >

  <div className="flex justify-between items-center">

  <div>

  <h3 className="text-lg font-semibold">
  {r.name}
  </h3>

  <p className="text-sm text-gray-400">
  Saved on {r.date}
  </p>

  </div>


  <div className="flex gap-3">

  <button
    onClick={()=>openReport(r)}
    className="bg-emerald-600 px-4 py-2 rounded text-white"
  >
  Open
  </button>

  <button
    onClick={()=>deleteReport(r.id)}
    className="bg-red-500 px-4 py-2 rounded text-white"
  >
  Delete
  </button>

  </div>

  </div>

  </div>

  ))}

  </div>

  </div>

  )

}
