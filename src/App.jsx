import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import WorkingCapital from "./pages/WorkingCapital";
import Agriculture from "./pages/Agriculture";
import Banking from "./pages/Banking";
import Dashboard from "./pages/Dashboard";
import Underwriting from "./pages/Underwriting";
import FinalReport from "./pages/FinalReport";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/working-capital" element={<WorkingCapital />} />

        <Route path="/agriculture" element={<Agriculture />} />

        <Route path="/banking" element={<Banking />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/underwriting" element={<Underwriting />} />

        <Route path="/final-report" element={<FinalReport />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
