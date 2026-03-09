import { useNavigate } from "react-router-dom";

export default function NavigationButtons({ prev, next, backHome = false }) {

const navigate = useNavigate();

return (

<div className="fixed top-3 left-0 right-0 flex justify-between px-4 z-50">

{/* LEFT BUTTON */}

{prev && (
<button
onClick={() => navigate(prev)}
className="bg-slate-800 px-4 py-2 rounded text-white"
>
{backHome ? "← Back to Home" : "← Previous"}
</button>
)}

{/* RIGHT BUTTON */}

{next && (
<button
onClick={() => navigate(next)}
className="bg-emerald-600 px-4 py-2 rounded text-white"
>
Next →
</button>
)}

</div>

);

}
