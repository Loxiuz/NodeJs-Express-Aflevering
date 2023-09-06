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

app.post("/artists", async (req, res) => {
  const newArtistBody = req.body;
  newArtistBody.id = new Date().getTime();

  const data = await fs.readFile("data/artists.json");
  const artists = JSON.parse(data);
  artists.push(newArtistBody);
  console.log(newArtistBody);

  await fs.writeFile("data/artists.json", JSON.stringify(artists));
  res.json(artists);
});

app.put("/artists/:id", async (req, res) => {
  const artistId = Number(req.params.id);
  console.log(artistId);

  const data = await fs.readFile("data/artists.json");
  const artists = JSON.parse(data);

  let artistToUpdate = artists.find((artist) => artist.id === artistId);
  console.log("Updating: " + artistToUpdate.name);
  const reqBody = req.body;
  console.log(reqBody);
  artistToUpdate.name = reqBody.name;
  artistToUpdate.birthdate = reqBody.birthdate;
  artistToUpdate.activeSince = reqBody.activeSince;
  artistToUpdate.genres = reqBody.genres;
  artistToUpdate.labels = reqBody.labels;
  artistToUpdate.website = reqBody.website;
  artistToUpdate.image = reqBody.image;
  artistToUpdate.shortDescription = reqBody.shortDescription;
  artistToUpdate.isFavorite = reqBody.isFavorite;

  await fs.writeFile("data/artists.json", JSON.stringify(artists));

  res.send(artists);
});

app.delete("/artists/:id", async (req, res) => {
  const artistId = Number(req.params.id);
  console.log(artistId);

  const data = await fs.readFile("data/artists.json");
  const artists = JSON.parse(data);

  const newArtistsArr = artists.filter((artist) => {
    return artist.id != artistId;
  });

  fs.writeFile("data/artists.json", JSON.stringify(newArtistsArr));
  res.json(newArtistsArr);
});
