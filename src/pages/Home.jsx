import { Link } from "react-router-dom";
import { BarChart3, Leaf, Landmark, FileText, FolderOpen } from "lucide-react";

export default function Home() {

  return (

    <div className="min-h-screen bg-slate-950 text-white p-6">

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          AI Credit Underwriting
        </h1>

        <p className="text-slate-400 mt-1 text-sm">
          Loan Origination & Credit Intelligence Platform
        </p>

      </div>


      {/* MODULE GRID */}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

        {/* WORKING CAPITAL */}

        <Link
          to="/working-capital"
          className="bg-slate-900 hover:bg-slate-800 transition p-6 rounded-xl flex flex-col items-center"
        >
          <BarChart3 size={30} className="text-blue-400"/>
          <span className="mt-3 text-sm font-semibold">
            Working Capital
          </span>
        </Link>


        {/* AGRICULTURE */}

        <Link
          to="/agriculture"
          className="bg-slate-900 hover:bg-slate-800 transition p-6 rounded-xl flex flex-col items-center"
        >
          <Leaf size={30} className="text-emerald-400"/>
          <span className="mt-3 text-sm font-semibold">
            Agriculture
          </span>
        </Link>


        {/* BANKING */}

        <Link
          to="/banking"
          className="bg-slate-900 hover:bg-slate-800 transition p-6 rounded-xl flex flex-col items-center"
        >
          <Landmark size={30} className="text-yellow-400"/>
          <span className="mt-3 text-sm font-semibold">
            Banking
          </span>
        </Link>


        {/* CAM REPORT */}

        <Link
          to="/final-report"
          className="bg-slate-900 hover:bg-slate-800 transition p-6 rounded-xl flex flex-col items-center"
        >
          <FileText size={30} className="text-purple-400"/>
          <span className="mt-3 text-sm font-semibold">
            CAM Report
          </span>
        </Link>


        {/* SAVED REPORTS */}

        <Link
          to="/saved"
          className="bg-slate-900 hover:bg-slate-800 transition p-6 rounded-xl flex flex-col items-center"
        >
          <FolderOpen size={30} className="text-orange-400"/>
          <span className="mt-3 text-sm font-semibold">
            Saved CAM Files
          </span>
        </Link>

      </div>

    </div>

  );

}
