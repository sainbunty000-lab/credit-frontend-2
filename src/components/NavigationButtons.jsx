import { useNavigate } from "react-router-dom";

export default function NavigationButtons({ prev, next }) {

  const navigate = useNavigate();

  return (
    <>

      {/* TOP NAVIGATION */}

      <div className="fixed top-4 left-4 right-4 flex justify-between z-50">

        {/* Previous Slide */}

        <button
          onClick={() => prev && navigate(prev)}
          className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-white"
        >
          ← Previous
        </button>

        {/* Next Slide */}

        <button
          onClick={() => next && navigate(next)}
          className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg text-white font-bold"
        >
          Next →
        </button>

      </div>


      {/* BOTTOM NAVIGATION */}

      <div className="fixed bottom-4 left-4 right-4 flex justify-between z-50">

        {/* Back to LOS Home */}

        <button
          onClick={() => navigate("/")}
          className="bg-slate-800 hover:bg-slate-700 px-5 py-2 rounded-lg text-white"
        >
          LOS Home
        </button>

        {/* Export to Final Report */}

        <button
          onClick={() => navigate("/final")}
          className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg text-white font-bold"
        >
          Export Report
        </button>

      </div>

    </>
  );

}
