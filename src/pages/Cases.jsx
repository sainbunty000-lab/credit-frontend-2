import { useEffect, useState } from "react";

export default function Cases() {

  const [cases, setCases] = useState([]);

  useEffect(() => {

    const stored = JSON.parse(localStorage.getItem("credit_app_v1")) || {};

    const savedCases = stored.saved_cases || [];

    setCases(savedCases);

  }, []);

  if (!cases.length) {

    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Saved Cases</h1>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-slate-400">
          No saved underwriting cases found.
        </div>
      </div>
    );

  }

  return (

    <div className="p-6 space-y-6">

      <h1 className="text-3xl font-bold mb-6">
        Saved Credit Cases
      </h1>

      {cases.map((c, i) => (

        <div
          key={i}
          className="bg-slate-900 p-6 rounded-xl border border-slate-800"
        >

          <div className="flex justify-between items-center">

            <div>

              <p className="text-lg font-semibold">
                {c.customer_name || "Unnamed Case"}
              </p>

              <p className="text-xs text-slate-400">
                Created: {c.createdAt || "-"}
              </p>

            </div>

            <div className="text-right">

              <p className="text-sm text-slate-400">
                Decision
              </p>

              <p
                className={`font-bold ${
                  c.decision === "APPROVED"
                    ? "text-emerald-400"
                    : c.decision === "DECLINED"
                    ? "text-red-400"
                    : "text-yellow-400"
                }`}
              >
                {c.decision || "Pending"}
              </p>

            </div>

          </div>


          <div className="grid grid-cols-3 gap-4 mt-4 text-sm">

            <Metric label="WC Score" value={c.wcScore} />

            <Metric label="Agri Score" value={c.agriScore} />

            <Metric label="Banking Score" value={c.bankingScore} />

          </div>

        </div>

      ))}

    </div>

  );

}


/* METRIC */

function Metric({ label, value }) {

  return (

    <div className="bg-slate-800 p-3 rounded-lg text-center">

      <p className="text-xs text-slate-400">
        {label}
      </p>

      <p className="text-lg font-bold">
        {value || 0}
      </p>

    </div>

  );

}
