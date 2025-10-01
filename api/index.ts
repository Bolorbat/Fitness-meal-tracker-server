import express from "express";
import { searchFood } from "./search-food.js";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

// Root
app.get("/", (req, res) => res.send("FatSecret + Supabase backend running 🚀"));

// FatSecret search
app.get("/search-food", async (req, res) => {
  try {
    const query = req.query.q as string;
    if (!query) return res.status(400).json({ error: "Missing query ?q=" });
    const data = await searchFood(query);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
