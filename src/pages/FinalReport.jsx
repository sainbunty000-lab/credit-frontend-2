import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { saveCurrentCase } from "../services/appStorage";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function FinalReport() {

  const [report, setReport] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {

    const stored = JSON.parse(localStorage.getItem("credit_app_v1")) || {};

    const wc = stored.workingCapital?.result || null;
    const agri = stored.agriculture?.result || null;
    const banking = stored.banking?.result || null;

    const wcScore = wc?.wc_score ?? null;
    const agriScore = agri?.agri_score ?? null;
    const bankingScore = banking?.risk_summary?.hygiene_score ?? null;

    /* SCORE CALCULATION (DYNAMIC) */

    let finalScore = 0;
    let weight = 0;

    if (wcScore !== null) {
      finalScore += wcScore * 0.4;
      weight += 0.4;
    }

    if (agriScore !== null) {
      finalScore += agriScore * 0.3;
      weight += 0.3;
    }

    if (bankingScore !== null) {
      finalScore += bankingScore * 0.3;
      weight += 0.3;
    }

    if (weight > 0) finalScore = finalScore / weight;

    let decision = "DECLINED";

    if (finalScore >= 80) decision = "APPROVED";
    else if (finalScore >= 65) decision = "CONDITIONAL APPROVAL";

    /* LIMIT CALCULATION */

    const wcLimit = wc?.drawing_power ?? 0;
    const agriLimit = agri?.eligible_loan_amount ?? 0;

    const recommendedLimit = Math.max(wcLimit, agriLimit);

    const caseData = {
      id: uuidv4(),
      wcScore,
      agriScore,
      bankingScore,
      finalScore,
      decision,
      recommendedLimit,
      createdAt: new Date().toISOString()
    };

    saveCurrentCase(caseData);

    setReport(caseData);
    setData({ wc, agri, banking });

  }, []);

  /* EXPORT PDF */

  const exportPDF = async () => {

    const element = document.getElementById("cam-report");

    const canvas = await html2canvas(element, { scale: 2 });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210;
    const pageHeight = 295;

    const imgHeight =
      (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

    heightLeft -= pageHeight;

    while (heightLeft >= 0) {

      position = heightLeft - imgHeight;

      pdf.addPage();

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

      heightLeft -= pageHeight;

    }

    pdf.save("CAM_Report.pdf");

  };

  if (!report || !data) return null;

  return (

    <div className="space-y-8">

      <div
        id="cam-report"
        className="bg-[#101c2e] p-10 rounded-xl border border-slate-800 space-y-8"
      >

        {/* HEADER */}

        <div className="border-b border-slate-700 pb-4">

          <h2 className="text-2xl font-bold text-emerald-400">
            Credit Assessment Memorandum
          </h2>

          <p className="text-sm text-slate-400">
            AI Powered Credit Intelligence Engine
          </p>

        </div>

        {/* SCORE SUMMARY */}

        <div className="grid grid-cols-3 gap-6">

          {report.wcScore !== null &&
            <ScoreCard title="Working Capital Score" value={report.wcScore} />
          }

          {report.agriScore !== null &&
            <ScoreCard title="Agriculture Score" value={report.agriScore} />
          }

          {report.bankingScore !== null &&
            <ScoreCard title="Banking Hygiene Score" value={report.bankingScore} />
          }

        </div>

        {/* FINAL DECISION */}

        <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">

          <p className="text-slate-400 text-sm">
            Final Risk Score
          </p>

          <h3 className="text-3xl font-bold text-white">
            {report.finalScore.toFixed(1)}
          </h3>

          <div className="mt-4">
            <DecisionBadge decision={report.decision} />
          </div>

        </div>

        {/* WORKING CAPITAL */}

        {data.wc && (

          <Section title="Working Capital Analysis">

            <Metric label="Current Ratio" value={data.wc.current_ratio} />
            <Metric label="WC Turnover" value={data.wc.wc_turnover} />
            <Metric label="Drawing Power" value={`₹ ${data.wc.drawing_power?.toLocaleString()}`} />

          </Section>

        )}

        {/* AGRICULTURE */}

        {data.agri && (

          <Section title="Agriculture Analysis">

            <Metric label="Disposable Income" value={`₹ ${data.agri.disposable_income?.toLocaleString()}`} />
            <Metric label="FOIR %" value={`${data.agri.foir_percent}%`} />
            <Metric label="Eligible Loan" value={`₹ ${data.agri.eligible_loan_amount?.toLocaleString()}`} />

          </Section>

        )}

        {/* BANKING */}

        {data.banking && (

          <Section title="Banking Behaviour">

            <Metric
              label="Total Credit"
              value={`₹ ${data.banking.statement_summary?.total_credit?.toLocaleString()}`}
            />

            <Metric
              label="Total Debit"
              value={`₹ ${data.banking.statement_summary?.total_debit?.toLocaleString()}`}
            />

            <Metric
              label="Bounce Count"
              value={data.banking.behavior_analysis?.bounce_count ?? 0}
            />

          </Section>

        )}

        {/* LIMIT */}

        <div className="bg-slate-900 p-6 rounded-lg border border-slate-700">

          <p className="text-slate-400 text-sm">
            Recommended Credit Limit
          </p>

          <h3 className="text-3xl font-bold text-emerald-400">
            ₹ {report.recommendedLimit.toLocaleString()}
          </h3>

        </div>

      </div>

      <button
        onClick={exportPDF}
        className="bg-emerald-500 px-6 py-3 rounded-md text-black font-semibold hover:bg-emerald-400"
      >
        Export CAM Report PDF
      </button>

    </div>

  );

}


/* COMPONENTS */

function ScoreCard({ title, value }) {

  return (

    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">

      <p className="text-xs text-slate-400">{title}</p>

      <h3 className="text-xl font-bold text-white mt-1">
        {value}
      </h3>

    </div>

  );

}

function Metric({ label, value }) {

  return (

    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">

      <p className="text-xs text-slate-400">{label}</p>

      <h3 className="text-lg font-bold text-white mt-1">
        {value ?? "-"}
      </h3>

    </div>

  );

}

function Section({ title, children }) {

  return (

    <div className="space-y-4">

      <h3 className="text-lg font-semibold text-emerald-400">
        {title}
      </h3>

      <div className="grid grid-cols-3 gap-6">
        {children}
      </div>

    </div>

  );

}

function DecisionBadge({ decision }) {

  let color = "bg-yellow-500";

  if (decision === "APPROVED")
    color = "bg-emerald-500";

  if (decision === "DECLINED")
    color = "bg-red-500";

  return (
    <span className={`${color} px-4 py-2 rounded-md text-black font-semibold`}>
      {decision}
    </span>
  );

}
