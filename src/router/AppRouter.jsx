import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import WorkingCapital from "../pages/WorkingCapital";
import Agriculture from "../pages/Agriculture";
import Banking from "../pages/Banking";
import FinalReport from "../pages/FinalReport";
import Underwriting from "../pages/Underwriting";

export default function AppRouter(){

return(

<BrowserRouter>

<Routes>

<Route path="/" element={<Dashboard/>} />
<Route path="/wc" element={<WorkingCapital/>} />
<Route path="/agriculture" element={<Agriculture/>} />
<Route path="/banking" element={<Banking/>} />
<Route path="/report" element={<FinalReport/>} />
<Route path="/underwriting" element={<Underwriting/>} />

</Routes>

</BrowserRouter>

)

}
