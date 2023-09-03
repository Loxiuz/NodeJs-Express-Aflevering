import express from "express";
import fs from "fs/promises";

const app = express();

const port = 8080;
app.listen(port, () => {
  console.log(`App kører på http://localhost:${port}`);
});
