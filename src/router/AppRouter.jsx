import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import WorkingCapital from "../pages/WorkingCapital";
import Agriculture from "../pages/Agriculture";
import Banking from "../pages/Banking";
import FinalReport from "../pages/FinalReport";

export default function AppRouter(){

return(

<BrowserRouter>

<Routes>

<Route path="/" element={<Home />} />

<Route path="/working-capital" element={<WorkingCapital />} />

<Route path="/agriculture" element={<Agriculture />} />

<Route path="/banking" element={<Banking />} />

<Route path="/final" element={<FinalReport />} />

</Routes>

</BrowserRouter>

)

}
