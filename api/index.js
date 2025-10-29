import express from "express";
import { searchFood } from "./fetchfood";

const app = express();
const PORT = 3000 | process.env.PORT;

app.use(express.json());

app.get("/", (req, res) => res.send("backend is running"));

app.get("/search-food", async (req, res) => {
  try {
    const query = req.params.query;
    const maxResults = req.params.maxResults;
    const pageNumber = req.accepted.pageNumber;
    if (!query) return res.status(400).json({ error: "query is missing ?q=" });
    const data = await searchFood(query, maxResults, pageNumber);
    res.json(data);
  } catch (err) {
    console.error("FatSecret error:", err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, "0,0,0,0", () =>
  console.log(`Server is runnin on port ${PORT}`)
);
