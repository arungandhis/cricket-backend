import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// ROUTES
import cricbuzzRoutes from "./routes/cricbuzzRoutes.js";


// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// STATIC FILES (optional)
app.use("/static", express.static(path.join(__dirname, "public")));

// ROUTES
app.use("/api/cricbuzz", cricbuzzRoutes);

// ROOT CHECK
app.get("/", (req, res) => {
  res.send("Cricket Broadcast Backend Running");
});

// START SERVER
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
