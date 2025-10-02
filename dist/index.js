import express from "express";
import { searchFood } from "./search-food.js";
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
// Root
app.get("/", (req, res) => res.send("FatSecret + Supabase backend running 🚀"));
//test
app.get("/test", (req, res) => {
  res.json({ ok: true, q: req.query.q });
});
// FatSecret search
app.get("/search-food", async (req, res) => {
  try {
    const query = req.query.q;
    const max_results = req.query.maxResults || 10;
    console.log("Calling FatSecret API with query:", query);
    if (!query) return res.status(400).json({ error: "Missing query ?q=" });
    const data = await searchFood(query, max_results);
    res.json(data);
  } catch (err) {
    console.error('FatSecret error:', err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
});
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);
