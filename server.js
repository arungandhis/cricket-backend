import express from "express";
import cors from "cors";
import espnRoutes from "./routes/espnRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/espn", espnRoutes);

app.get("/", (req, res) => {
  res.send("Cricket backend running (ESPN Cricinfo)");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
