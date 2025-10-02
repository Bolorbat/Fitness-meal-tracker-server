import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const TOKEN_URL = "https://oauth.fatsecret.com/connect/token";
const API_URL = "https://platform.fatsecret.com/rest/server.api";
let cachedToken = null;
let tokenExpiry = 0;
async function getAccessToken() {
  const now = Date.now();
  if (cachedToken && now < tokenExpiry) return cachedToken;
  const response = await axios.post(
    TOKEN_URL,
    new URLSearchParams({ grant_type: "client_credentials", scope: "basic" }),
    {
      auth: {
        username: process.env.FATSECRET_CLIENT_ID,
        password: process.env.FATSECRET_CLIENT_SECRET,
      },
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );
  cachedToken = response.data.access_token;
  tokenExpiry = now + response.data.expires_in * 1000 - 60000;
  return cachedToken;
}
export async function searchFood(query, maxResults) {
  try {
    const token = await getAccessToken();
    console.log("Using token:", token);
    const response = await axios.get(API_URL, {
      params: {
        method: "foods.search",
        search_expression: query,
        max_results: maxResults,
        format: "json",
      },
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("API response:", response.data);
    return response.data;
  } catch (err) {
    console.error("Fatsecret API error: ", err?.response?.data || err.message);
    throw new Error("Request failed with status code " + err.response?.status);
  };
};
