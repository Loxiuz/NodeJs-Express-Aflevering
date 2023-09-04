import express from "express";
import fs from "fs/promises";

const app = express();
app.use(express.json());

const port = 8080;
app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});

//Homepage
app.get("/", (req, res) => {
  res.send("This is the homepage");
});
