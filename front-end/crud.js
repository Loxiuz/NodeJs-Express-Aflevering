const endpoint = "http://localhost:8080";

async function getArtists() {
  const res = await fetch(`${endpoint}/artists`);
  const data = await res.json();
  return prepareData(data);

  function prepareData(data) {
    const dataArr = [];
    for (const key in data) {
      const dataObject = data[key];
      dataObject.id = key;
      dataArr.push(dataObject);
    }
    return dataArr;
  }
}

function createArtistClicked() {
  console.log("Add Artist");
}

function updateArtistClicked(artist) {
  console.log(`Editing: ${artist.name}`);

  document
    .querySelector("#artists-grid .artists-grid-item:last-child #update-btn")
    .removeEventListener("click", () => {
      updateArtistClicked(artist);
    });
}

function deleteArtistClicked(artistId) {
  console.log(`Deleted: ${artistId}`);
}

export {
  getArtists,
  createArtistClicked,
  updateArtistClicked,
  deleteArtistClicked,
};
