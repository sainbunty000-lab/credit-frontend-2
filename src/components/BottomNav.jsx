import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function BottomNav(){

return(

<div className="fixed bottom-6 left-0 right-0 flex justify-center z-50">

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
