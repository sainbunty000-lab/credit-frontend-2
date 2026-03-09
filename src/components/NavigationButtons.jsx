import { useNavigate } from "react-router-dom";

export default function NavigationButtons({ prev, next }) {

const navigate = useNavigate();

return (

<>

{/* TOP NAVIGATION */}

<div className="fixed top-4 left-4 right-4 flex justify-between z-50">

<button
onClick={() => prev && navigate(prev)}
className="bg-slate-800 px-4 py-2 rounded text-white"
>
← Previous
</button>

<button
onClick={() => next && navigate(next)}
className="bg-emerald-600 px-4 py-2 rounded text-white"
>
Next →
</button>

</div>


{/* BOTTOM NAVIGATION */}

<div className="fixed bottom-4 left-4 right-4 flex justify-between z-50">

<button
onClick={() => navigate("/") }
className="bg-slate-700 px-5 py-2 rounded text-white"
>
LOS Home
</button>

<button
onClick={() => navigate("/final-report")}
className="bg-blue-600 px-5 py-2 rounded text-white"
>
Export Report
</button>

</div>

</>

);

}
