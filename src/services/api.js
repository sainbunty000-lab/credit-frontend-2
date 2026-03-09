const API = "https://credit-backend-production-d988.up.railway.app";

/* AGRICULTURE */

export const agriCalculate = async (data) => {

  const res = await fetch(`${API}/agriculture/calculate`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify(data)
  });

  return res.json();
};


/* BANKING */

export const bankingAnalyze = async (formData) => {

  const res = await fetch(`${API}/banking/full-analysis`,{
    method:"POST",
    body:formData
  });

  return res.json();
};


/* WORKING CAPITAL */

export const wcUploadDual = async (formData) => {

  const res = await fetch(`${API}/wc/upload-dual`,{
    method:"POST",
    body:formData
  });

  return res.json();
};


export const wcManualCalc = async (data) => {

  const res = await fetch(`${API}/wc/manual-calc`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify(data)
  });

  return res.json();
};
