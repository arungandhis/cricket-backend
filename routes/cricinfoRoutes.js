import express from "express";
import { extractMatchesFromHTML } from "../services/cricinfoService.js";

const router = express.Router();

router.post("/matches", (req, res) => {
  console.log("=== Cricinfo route HIT ===");

  const { html } = req.body;
console.log("HTML received length:", html.length);
  if (!html) {
    console.log("No HTML received!");
    return res.json([]);
  }

  const matches = extractMatchesFromHTML(html);

  console.log("Parsed matches:", matches);


  res.json(matches);
});

export default router;
