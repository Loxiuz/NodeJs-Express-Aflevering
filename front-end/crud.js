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

  const dialog = document.querySelector("#detailedArtistDialog");
  dialog.innerHTML = "";
  dialog.insertAdjacentHTML(
    "afterbegin",
    /* html */ `
    <h3>Slet ${artist.name}?</h3>
    <button id="yes-btn">Ja</button>
    <button id="no-btn">Nej</button>`
  );
  dialog.showModal();

  document.querySelector("#no-btn").addEventListener("click", () => {
    dialog.close();
  });
  document.querySelector("#yes-btn").addEventListener("click", () => {
    deleteArtist();
  });

  async function deleteArtist() {
    console.log(`Deleting: ${artist.name}`);
    const res = await fetch(`${endpoint}/artists/${artist.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      console.log(`${artist.name} deleted!`);
    } else {
      console.log(`Error deleting ${artist.name}`);
    }
  }
}

export {
  getArtists,
  createArtistClicked,
  updateArtistClicked,
  deleteArtistClicked,
};
