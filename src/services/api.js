const API = "https://credit-backend-production-d988.up.railway.app";

/* ==============================
   AGRICULTURE CALCULATION
============================== */

export const agriCalculate = async (data) => {

  try {

    const res = await fetch(`${API}/agri`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(data)
    });

    if(!res.ok){
      throw new Error("Agriculture API error");
    }

    const json = await res.json();
    return json;

  } catch(err){

    console.error("Agri API Error:",err);

    return {
      status:"Error",
      message:"Agriculture service unavailable"
    };

  }

};


/* ==============================
   BANKING STATEMENT ANALYSIS
============================== */

export const bankingAnalyze = async (formData) => {

  try{

    const res = await fetch(`${API}/banking`,{
      method:"POST",
      body:formData
    });

    if(!res.ok){
      throw new Error("Banking API error");
    }

    const json = await res.json();
    return json;

  }catch(err){

    console.error("Banking API Error:",err);

    return {
      status:"Error",
      message:"Banking analysis failed"
    };

  }

};


/* ==============================
   WORKING CAPITAL ANALYSIS
============================== */

export const wcAnalyze = async (formData) => {

  try{

    const res = await fetch(`${API}/wc`,{
      method:"POST",
      body:formData
    });

    if(!res.ok){
      throw new Error("Working Capital API error");
    }

    const json = await res.json();
    return json;

  }catch(err){

    console.error("WC API Error:",err);

    return {
      status:"Error",
      message:"Working Capital analysis failed"
    };

  }

};
