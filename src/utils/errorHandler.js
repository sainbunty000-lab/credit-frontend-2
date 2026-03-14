export function logError(error, context = "") {
  if (import.meta.env.DEV) {
    console.error(`[${context}]`, error);
  }
}

export function getErrorMessage(error) {
  if (error?.message) return error.message;
  if (typeof error === "string") return error;
  return "An unexpected error occurred. Please try again.";
}

export function handleApiError(
  error,
  fallbackMessage = "Request failed. Please try again."
) {
  logError(error, "API");
  return fallbackMessage;
}
