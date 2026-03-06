const STORAGE_KEY = "credit_app_v1";

/* LOAD APP DATA */

export function loadApp() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
}

/* SAVE APP DATA */

export function saveApp(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/* SAVE CASE HISTORY */

export function saveCurrentCase(caseData) {

  const saved =
    JSON.parse(localStorage.getItem("saved_cases")) || [];

  saved.push(caseData);

  localStorage.setItem(
    "saved_cases",
    JSON.stringify(saved)
  );

}
