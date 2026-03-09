import { useNavigate } from "react-router-dom";

export default function ExportCAM() {

  const navigate = useNavigate();

  return (

    <div className="fixed bottom-4 right-4 z-50">

      <button
        onClick={() => navigate("/final")}
        className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-5 py-3 rounded-xl shadow-lg"
      >
        Export to CAM
      </button>

    </div>

  );

}
