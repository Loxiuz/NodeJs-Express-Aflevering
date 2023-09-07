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

app.get("/", (req, res) => {
  res.send("This is the homepage of the server");
});
/* Creates the GET route for artists with "/artists" as endpoint*/
app.get("/artists", async (req, res) => {
  //Gets the data from a json-file
  const data = await fs.readFile("data/artists.json");
  const json = JSON.parse(data);
  res.json(json);
});
/* Creates a POST route for artists with "/artists" as endpoint*/
app.post("/artists", async (req, res) => {
  const newArtistBody = req.body; //Gets the request body
  newArtistBody.id = new Date().getTime(); //Generates a random id
  //Gets current data from the json file
  const data = await fs.readFile("data/artists.json");
  const artists = JSON.parse(data);
  artists.push(newArtistBody); //Pushes the new object to the array
  console.log(newArtistBody);
  //Writes the array with the new object back to the json file
  await fs.writeFile("data/artists.json", JSON.stringify(artists));
  res.json(artists);
});
/* Creates a PUT route for artists with "/artists/:id" as endpoint
      to access the given artist*/
app.put("/artists/:id", async (req, res) => {
  const artistId = Number(req.params.id);
  console.log(artistId);
  //Gets current data from json file
  const data = await fs.readFile("data/artists.json");
  const artists = JSON.parse(data);
  //Finds the given artists with id
  let artistToUpdate = artists.find((artist) => artist.id === artistId);
  console.log("Updating: " + artistToUpdate.name);
  //Compares the body of the request and the artist to update
  for (const prop in req.body) {
    //Check of the artist to update has the properties of the request body
    if (req.body.hasOwnProperty(prop) && artistToUpdate.hasOwnProperty(prop)) {
      //Updates the property of the artist
      artistToUpdate[prop] = req.body[prop];
    }
  }
  //Writes the updated artists array back the json file
  await fs.writeFile("data/artists.json", JSON.stringify(artists));

  res.send(artists);
});
/* Creates a DELETE route artists with "/artists/:id" as endpoint
   to access the given artist */
app.delete("/artists/:id", async (req, res) => {
  const artistId = Number(req.params.id);
  console.log(artistId);
  //Gets the current data from the json file
  const data = await fs.readFile("data/artists.json");
  const artists = JSON.parse(data);
  //Makes a new array with all the artist except for the one being deleted
  const newArtistsArr = artists.filter((artist) => {
    return artist.id != artistId; //Skips the artist being deleted
  });
  //Writes new artists array without the deleted artist
  fs.writeFile("data/artists.json", JSON.stringify(newArtistsArr));
  res.json(newArtistsArr);
});
