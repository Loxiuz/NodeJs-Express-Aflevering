import express from "express";
import cors from "cors";
import fs from "fs/promises";

const app = express();
app.use(express.json());
app.use(cors());

const port = 8080;
app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});

//Homepage
app.get("/", (req, res) => {
  res.send("This is the homepage");
});

app.get("/artists", async (req, res) => {
  const data = await fs.readFile("data/artists.json");
  const json = JSON.parse(data);
  res.json(json);
});
