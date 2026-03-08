// backend/server.js
import express from "express";
import cors from "cors";
import cricketDataRoutes from "./routes/cricketDataRoutes.js";
import matchRoutes from "./routes/matchRoutes.js"; // your existing match settings

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Cricbuzz-backed cricket API
app.use("/api/cricket", cricketDataRoutes);

// Match settings (existing)
app.use("/api/match", matchRoutes);

app.get("/", (req, res) => {
  res.send("Cricket backend running (Cricbuzz API)");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
