import express from "express";
import { searchFood } from "./fetchfood.js";
import dotenv from "dotenv"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => res.send("backend is running"));

app.get("/search-food", async (req, res) => {
  try {
    const {q : query, maxResults, pageNumber} = req.query;
    if (!query) return res.status(400).json({ error: "query is missing ?q=" });
    const data = await searchFood(query, maxResults, pageNumber);
    res.json(data);
  } catch (err) {
    console.error("FatSecret error:", err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server is runnin on port ${PORT}`)
);
