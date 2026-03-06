import { Link } from "react-router-dom";
import { Home, BarChart3, Leaf, Landmark, FileText } from "lucide-react";

export default function BottomNav(){

return(

<div className="fixed bottom-0 left-0 right-0 bg-slate-900 flex justify-around p-3 text-white">

<Link to="/"><Home size={20}/></Link>

<Link to="/working-capital"><BarChart3 size={20}/></Link>

<Link to="/agriculture"><Leaf size={20}/></Link>

<Link to="/banking"><Landmark size={20}/></Link>

<Link to="/final-report"><FileText size={20}/></Link>

</div>

)

}
