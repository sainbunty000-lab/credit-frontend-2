import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import WorkingCapital from "./pages/WorkingCapital";
import Agriculture from "./pages/Agriculture";
import Banking from "./pages/Banking";
import FinalReport from "./pages/FinalReport";

import { Home as HomeIcon, BarChart3, Leaf, Landmark, FileText } from "lucide-react";

function BottomNav(){
return(
<div className="fixed bottom-0 left-0 right-0 bg-slate-900 flex justify-around p-3 text-white">

<Link to="/"><HomeIcon size={22}/></Link>

<Link to="/working-capital"><BarChart3 size={22}/></Link>

<Link to="/agriculture"><Leaf size={22}/></Link>

<Link to="/banking"><Landmark size={22}/></Link>

<Link to="/final-report"><FileText size={22}/></Link>

</div>
)
}

function App(){
return(

<BrowserRouter>

<Routes>

<Route path="/" element={<Home/>} />

<Route path="/working-capital" element={<WorkingCapital/>} />

<Route path="/agriculture" element={<Agriculture/>} />

<Route path="/banking" element={<Banking/>} />

<Route path="/final-report" element={<FinalReport/>} />

</Routes>

<BottomNav/>

</BrowserRouter>

)
}

export default App;
