export default function DecisionBadge({decision}){

let color="orange";

if(decision==="APPROVED") color="green";
if(decision==="DECLINED") color="red";

return(

<span style={{color,fontWeight:"bold"}}>

{decision}

</span>

)

}
