export function calculateScore(wc, agri, banking){

const wcScore = wc?.wc_score || 0
const agriScore = agri?.agri_score || 0
const bankScore = banking?.hygiene_score || 0

const finalScore =
(wcScore*0.4) +
(agriScore*0.3) +
(bankScore*0.3)

let decision="DECLINED"

if(finalScore>=80) decision="APPROVED"
else if(finalScore>=65) decision="CONDITIONAL"

return{
finalScore,
decision
}

}
