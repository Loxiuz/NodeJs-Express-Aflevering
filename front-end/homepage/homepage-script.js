import {
  getArtists,
  createArtistClicked,
  updateArtistClicked,
  deleteArtistClicked,
} from "../crud.js";

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
  console.log(artists);
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
    document
      .querySelector("#artists-grid .artists-grid-item:last-child #update-btn")
      .addEventListener("click", () => {
        updateArtistClicked(artist);
      });
    document
      .querySelector("#artists-grid .artists-grid-item:last-child #delete-btn")
      .addEventListener("click", () => {
        deleteArtistClicked(artist);
      });
    document
      .querySelector("#artists-grid .artists-grid-item:last-child img")
      .addEventListener("click", () => {
        imageClicked(artist);
      });
  }

  artists.forEach(displayArtist);
}

async function updateArtGrid() {
  console.log("Updated Artists Grid");
  const artists = await getArtists();
  displayArtists(artists);
}

function favoritesBtnClicked() {
  console.log("Showing favorites");
  document
    .querySelector("#favorites-btn")
    .removeEventListener("click", favoritesBtnClicked);
}

function imageClicked(artist) {
  console.log("Showing details");
  document
    .querySelector("#artists-grid .artists-grid-item:last-child img")
    .removeEventListener("click", () => {
      imageClicked(artist);
    });
}
