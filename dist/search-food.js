import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const TOKEN_URL = "https://oauth.fatsecret.com/connect/token";
const API_URL = "https://platform.fatsecret.com/rest/server.api";
let cachedToken = null;
let tokenExpiry = 0;
async function getAccessToken() {
    const now = Date.now();
    if (cachedToken && now < tokenExpiry)
        return cachedToken;
    const response = await axios.post(TOKEN_URL, new URLSearchParams({ grant_type: "client_credentials", scope: "basic" }), {
        auth: {
            username: process.env.EXPO_PUBLIC_FATSECRET_CLIENT_ID!,
            password: process.env.EXPO_PUBLIC_FATSECRET_CLIENT_SECRET!,
        },
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    cachedToken = response.data.access_token;
    tokenExpiry = now + response.data.expires_in * 1000 - 60000;
    return cachedToken;
}
export async function searchFood(query) {
    const token = await getAccessToken();
    const response = await axios.get(API_URL, {
        params: { method: "foods.search", search_expression: query, format: "json" },
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
}
