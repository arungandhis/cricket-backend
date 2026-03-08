import express from "express";
import cors from "cors";
import cricketDataRoutes from "./routes/cricketDataRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/cricket", cricketDataRoutes);

app.get("/", (req, res) => {
  res.send("Cricket backend running (CricketData API)");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
