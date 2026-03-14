import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import WorkingCapital from "./pages/WorkingCapital";
import Agriculture from "./pages/Agriculture";
import Banking from "./pages/Banking";
import FinalReport from "./pages/FinalReport";
import SavedReports from "./pages/SavedReports";

import BottomNav from "./components/BottomNav";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App(){

return(

<ErrorBoundary>
<BrowserRouter>

<div className="pb-20">

<Routes>

<Route path="/" element={<Home/>} />

<Route path="/working-capital" element={<WorkingCapital/>} />

<Route path="/agriculture" element={<Agriculture/>} />

<Route path="/banking" element={<Banking/>} />

<Route path="/final-report" element={<FinalReport/>} />

{/* SAVED CAM REPORTS */}

<Route path="/saved" element={<SavedReports/>} />

</Routes>

</div>

<BottomNav/>

</BrowserRouter>
</ErrorBoundary>

)

}
