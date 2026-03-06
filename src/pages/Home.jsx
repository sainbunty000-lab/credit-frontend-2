import { Link } from "react-router-dom";
import { BarChart3, Leaf, Landmark, FileText } from "lucide-react";

export default function Home() {
  return (

    <div className="min-h-screen bg-slate-950 text-white p-6">

      <h1 className="text-3xl font-bold mb-6">
        AI Credit Underwriting
      </h1>

      <div className="grid grid-cols-2 gap-4">

        <Link
          to="/working-capital"
          className="bg-slate-900 p-6 rounded-xl flex flex-col items-center"
        >
          <BarChart3 size={30} />
          <span className="mt-2">Working Capital</span>
        </Link>

        <Link
          to="/agriculture"
          className="bg-slate-900 p-6 rounded-xl flex flex-col items-center"
        >
          <Leaf size={30} />
          <span className="mt-2">Agriculture</span>
        </Link>

        <Link
          to="/banking"
          className="bg-slate-900 p-6 rounded-xl flex flex-col items-center"
        >
          <Landmark size={30} />
          <span className="mt-2">Banking</span>
        </Link>

        <Link
          to="/final-report"
          className="bg-slate-900 p-6 rounded-xl flex flex-col items-center"
        >
          <FileText size={30} />
          <span className="mt-2">CAM Report</span>
        </Link>

      </div>

    </div>

  );
}
