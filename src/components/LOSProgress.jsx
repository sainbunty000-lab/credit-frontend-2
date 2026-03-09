import { useLocation } from "react-router-dom";

export default function LOSProgress() {

  const location = useLocation();

  const steps = [
    { name: "Working Capital", path: "/" },
    { name: "Agriculture", path: "/agriculture" },
    { name: "Banking", path: "/banking" },
    { name: "Final CAM", path: "/final" }
  ];

  return (

    <div className="w-full mb-6">

      <div className="flex justify-between items-center bg-[#0f172a] p-3 rounded-xl border border-slate-800">

        {steps.map((step, index) => {

          const active = location.pathname === step.path;

          return (

            <div
              key={index}
              className={`flex-1 text-center text-xs sm:text-sm font-semibold
              ${active ? "text-emerald-400" : "text-slate-500"}`}
            >

              <div
                className={`mx-auto w-6 h-6 rounded-full mb-1 flex items-center justify-center
                ${active ? "bg-emerald-500 text-black" : "bg-slate-700"}`}
              >
                {index + 1}
              </div>

              {step.name}

            </div>

          );

        })}

      </div>

    </div>

  );

}
