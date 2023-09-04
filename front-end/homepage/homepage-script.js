import getArtists from "../crud.js";

("use strict");

window.addEventListener("load", start);

function start() {
  updateArtGrid();

  document
    .querySelector("#favorites-btn")
    .addEventListener("click", favoritesBtnClicked);
  document
    .querySelector("#create-btn")
    .addEventListener("click", createArtistClicked);
}

function displayArtists(artists) {
  console.log("Displaying artists");
  document.querySelector("#artists-grid").innerHTML = "";

  function displayArtist(artist) {
    document.querySelector("#artists-grid").insertAdjacentHTML(
      "beforeend",
      /* html */ `
        <div class="artists-grid-item">
            <img src=${artist.image}>
            <div id = "name">${artist.name}</div>
            <div id = "genres">${artist.genres}</div>
            <button id="update-btn">Redigér</button>
            <button id="delete-btn">Slet</button>
        </div>
  `
    );
  }
  artists.forEach(displayArtist);
}

async function updateArtGrid() {
  console.log("Updated Artists Grid");
  const artists = await getArtists();
  displayArtists(artists);
}

function favoritesBtnClicked() {}

function createArtistClicked() {}

function updateArtistClicked() {}

function deleteArtistClicked() {}
