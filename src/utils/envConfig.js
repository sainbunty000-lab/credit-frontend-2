/**
 * envConfig – centralised environment configuration.
 * Import this module in any component or service that needs to
 * reference runtime environment settings (API URL, mode flags).
 * Example: import envConfig from "../utils/envConfig";
 */
import { API_BASE_URL } from "../config/constants";

export const envConfig = {
  apiUrl: API_BASE_URL,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
};

export default envConfig;
