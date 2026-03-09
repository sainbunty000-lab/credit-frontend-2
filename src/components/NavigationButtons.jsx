import { useNavigate } from "react-router-dom";

export default function NavigationButtons({ prev, next }) {

const navigate = useNavigate();

return (

<div className="fixed top-3 left-0 right-0 flex justify-between px-4 z-50">

{prev && (
<button
onClick={() => navigate(prev)}
className="bg-slate-800 px-4 py-2 rounded text-white"
>
← Previous
</button>
)}

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

{/* BOTTOM NAVIGATION */}

import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function BottomNav(){

return(

<div className="fixed bottom-3 left-0 right-0 flex justify-center z-50">

<Link
to="/"
className="flex items-center gap-2 bg-slate-800 px-6 py-2 rounded-lg text-white shadow-lg"
>

<Home size={20}/>
<span className="text-sm font-medium">WC / Agri Home</span>

</Link>

</div>

)

}
