import axios from "axios";

/*
========================================
API BASE URL
Uses environment variable in production
========================================
*/

const API =
  import.meta.env.VITE_API_URL ||
  "https://credit-backend-production-d988.up.railway.app";

/*
========================================
WORKING CAPITAL
Upload Balance Sheet + P&L
========================================
*/

export const wcUpload = async (balanceSheet, profitLoss) => {

  const formData = new FormData();

  formData.append("balance_sheet", balanceSheet);
  formData.append("profit_loss", profitLoss);

  const response = await axios.post(
    `${API}/wc/upload-dual`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );

  return response.data;
};


/*
========================================
WORKING CAPITAL MANUAL CALCULATION
========================================
*/

export const wcManualCalc = async (data) => {

  const response = await axios.post(
    `${API}/wc/manual-calc`,
    data
  );

  return response.data;
};


/*
========================================
AGRICULTURE MODEL
========================================
*/

export const agriCalculate = async (data) => {

  const response = await axios.post(
    `${API}/agriculture/calculate`,
    data
  );

  return response.data;
};


/*
========================================
BANKING STATEMENT ANALYSIS
========================================
*/

export const bankingAnalyze = async (file) => {

  const formData = new FormData();

  formData.append("file", file);

  const response = await axios.post(
    `${API}/banking/full-analysis`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );

  return response.data;
};
