import express from "express";
import cors from "cors";
import cricketDataRoutes from "./routes/cricketDataRoutes.js";
import matchRoutes from "./routes/matchRoutes.js"; // your match settings route

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// CricketData API
app.use("/api/cricket", cricketDataRoutes);

// Match settings (matchId, apiKey, pollInterval, rtmp, etc.)
app.use("/api/match", matchRoutes);

app.get("/", (req, res) => {
  res.send("Cricket backend running (CricketData API)");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
