import { API_BASE_URL } from "../config/constants";
import { logError } from "../utils/errorHandler";

const checkResponse = async (res) => {
  if (!res.ok) {
    throw new Error(`Server error: ${res.status} ${res.statusText}`);
  }
  return res.json();
};


/* AGRICULTURE */

export const agriCalculate = async (data) => {

  try {

    const res = await fetch(`${API_BASE_URL}/agriculture/calculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return checkResponse(res);

  } catch (err) {

    logError(err, "agriCalculate");
    throw err;

  }

};


/* BANKING */

export const bankingAnalyze = async (formData) => {

  try {

    const res = await fetch(`${API_BASE_URL}/banking/full-analysis`, {
      method: "POST",
      body: formData,
    });

    return checkResponse(res);

  } catch (err) {

    logError(err, "bankingAnalyze");
    throw err;

  }

};


/* WORKING CAPITAL */

export const wcUploadDual = async (formData) => {

  try {

    const res = await fetch(`${API_BASE_URL}/wc/upload-dual`, {
      method: "POST",
      body: formData,
    });

    return checkResponse(res);

  } catch (err) {

    logError(err, "wcUploadDual");
    throw err;

  }

};

export const wcManualCalc = async (data) => {

  try {

    const res = await fetch(`${API_BASE_URL}/wc/manual-calc`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return checkResponse(res);

  } catch (err) {

    logError(err, "wcManualCalc");
    throw err;

  }

};
