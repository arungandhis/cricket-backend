import express from "express";
import cors from "cors";
import cricketDataRoutes from "./routes/cricketDataRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

app.use("/api/cricket", cricketDataRoutes);
app.use("/api/match", matchRoutes);

app.get("/", (req, res) => {
  res.send("Cricket backend running (Cricbuzz API)");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
