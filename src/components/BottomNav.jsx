import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function BottomNav(){

return(

<div className="fixed bottom-0 left-0 right-0 bg-slate-900 flex justify-center p-3 text-white border-t border-slate-800 z-50">

<Link
to="/"
className="flex items-center gap-2 bg-slate-800 px-6 py-2 rounded-lg hover:bg-slate-700 transition"
>

<Home size={20}/>
<span className="text-sm font-medium">WC / Agri Home</span>

</Link>

</div>

)

}
