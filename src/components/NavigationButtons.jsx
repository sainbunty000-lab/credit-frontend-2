import { useNavigate } from "react-router-dom";

export default function NavigationButtons({ prev, next, children }) {

const navigate = useNavigate();

return (

<div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex items-center justify-between">

{/* LEFT BUTTON */}

{prev ? (
<button
onClick={() => navigate(prev)}
className="bg-slate-800 px-4 py-2 rounded text-white"
>
← Previous
</button>
) : <div></div>}

{/* CENTER CONTENT (STEP BAR) */}

<div className="flex-1 flex justify-center">
{children}
</div>

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
