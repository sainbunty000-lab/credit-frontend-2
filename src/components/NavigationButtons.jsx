import { useNavigate } from "react-router-dom";

export default function NavigationButtons({ prev, next }) {

const navigate = useNavigate();

return (

<>

{/* TOP BUTTONS */}

<div className="fixed top-4 left-4 right-4 flex justify-between">

<button
onClick={() => navigate(prev)}
className="bg-slate-800 px-4 py-2 rounded text-white"
>
← Previous
</button>

<button
onClick={() => navigate(next)}
className="bg-emerald-600 px-4 py-2 rounded text-white"
>
Next →
</button>

</div>


{/* BOTTOM BUTTONS */}

<div className="fixed bottom-4 left-4 right-4 flex justify-between">

<button
onClick={() => navigate("/") }
className="bg-slate-700 px-5 py-2 rounded text-white"
>
LOS Home
</button>

<button
onClick={() => navigate("/final")}
className="bg-blue-600 px-5 py-2 rounded text-white"
>
Export Report
</button>

</div>

</>

);

}
