import axios from "axios";

const TOKEN_URL = "https://oauth.fatsecret.com/connect/token";
const API_URL = "https://platform.fatsecret.com/rest/foods/search/v4";

let cachedToken = null;
let tokenExpiry = 0;

async function getAccesToken() {
  const date = Date.now();
  if (cachedToken && date < tokenExpiry) return cachedToken;

  const response = await axios.post(
    TOKEN_URL,
    new URLSearchParams({ grant_type: "client_credentials", scope: "premier" }),
    {
      auth: {
        username: process.env.FATSECRET_CLIENT_ID,
        password: process.env.FATSECRET_CLIENT_SECRET,
      },
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );
  cachedToken = response.data.access_token;
  tokenExpiry = date + response.data.expires_in * 1000 - 10000;

  return cachedToken;
}

export async function searchFood(query, maxResults, pageNumber) {
  try {
    const token = await getAccesToken();
    const response = await axios.get(API_URL, {
      params: { search_expression: query, max_results : maxResults, page_number: pageNumber, format : json},
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("food api : ", response.data);
    return response.data;
  } catch (err) {
    console.log("Fatsecret api error : ", response?.data || err.message);
    throw new Error(err.response?.data);
  }
}
