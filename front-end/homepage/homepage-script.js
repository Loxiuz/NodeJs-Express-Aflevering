import {
  getArtists,
  createArtistClicked,
  updateArtistClicked,
  deleteArtistClicked,
  setArtistFavorit,
} from "../crud.js";

("use strict");

window.addEventListener("load", start);

function start() {
  updateArtGrid();
  makeFilterCheckboxes();
  document
    .querySelector("#favorites-btn")
    .addEventListener("change", favoritesClicked);
  document
    .querySelector("#create-btn")
    .addEventListener("click", createArtistClicked);
  document
    .querySelector("#filter-form")
    .addEventListener("change", filterArtistsByGenre);
  document
    .querySelector("#sort-select")
    .addEventListener("change", sortArtists);
}

function displayArtists(artists) {
  console.log("Displaying artists");
  console.log(artists);
  document.querySelector("#artists-grid").innerHTML = "";

  function displayArtist(artist) {
    document.querySelector("#artists-grid").insertAdjacentHTML(
      "afterbegin",
      /* html */ `
        <div class="artists-grid-item">
            <img src=${artist.image}>
            <p>Favorit: ${artist.isFavorite}</p>
            <p id = "name">${artist.name}</p>
            <p id = "genres">${artist.genres}</p>
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
    if (artist.isFavorite === true) {
      document
        .querySelector("#artists-grid .artists-grid-item:last-child")
        .insertAdjacentHTML(
          "beforeend",
          /* html */ `
          <button id="removeFromFav-btn">Fjern fra favoritter</button>
       `
        );
      document
        .querySelector(
          "#artists-grid .artists-grid-item:last-child #removeFromFav-btn"
        )
        .addEventListener("click", () => {
          setArtistFavorit(artist, false);
        });
    } else {
      document
        .querySelector("#artists-grid .artists-grid-item:last-child")
        .insertAdjacentHTML(
          "beforeend",
          /* html */ `
      <button id="addToFav-btn">Føj til favoritter</button>
       `
        );
      document
        .querySelector(
          "#artists-grid .artists-grid-item:last-child #addToFav-btn"
        )
        .addEventListener("click", () => {
          setArtistFavorit(artist, true);
        });
    }
  }
  artists.forEach(displayArtist);
}

async function updateArtGrid() {
  console.log("Updated Artists Grid");
  const artists = await getArtists();
  displayArtists(artists);
}

async function favoritesClicked() {
  console.log("Showing favorites");
  document
    .querySelector("#favorites-btn")
    .removeEventListener("click", favoritesClicked);

  const checkbox = document.querySelector("#favorites-btn");
  if (checkbox.checked) {
    const artists = await getArtists();
    const favorites = artists.filter((artist) => {
      return artist.isFavorite === true;
    });
    displayArtists(favorites);
  } else {
    updateArtGrid();
  }
}

function imageClicked(artist) {
  console.log("Showing details");
  document
    .querySelector("#artists-grid .artists-grid-item:last-child img")
    .removeEventListener("click", () => {
      imageClicked(artist);
    });

  const dialog = document.querySelector("#detailedArtistDialog");
  dialog.innerHTML = "";
  dialog.insertAdjacentHTML(
    "beforeend",
    /* html */ `
    <button id="close-details-btn">X</button>
    <img src=${artist.image}> 
    <h2>${artist.name}</h2>
    <p>${artist.shortDescription}</p>  
    <ul>
      <li>${artist.birthdate}</li>
      <li>${artist.activeSince}</li>
      <li>${artist.genres}</li>
      <li>${artist.labels}</li>
      <li>${artist.website}</li>
    </ul>
  `
  );
  dialog.showModal();
  document.querySelector("#close-details-btn").addEventListener("click", () => {
    dialog.close();
  });
}

async function makeFilterCheckboxes() {
  console.log("Creation of filter checkboxes");
  const genres = await getGenresFromArtists();
  for (let i = 0; i < genres.length; i++) {
    const genresHtml = /* html */ `
    <input 
      type="checkbox" 
      name="genre" 
      id="${genres[i].toLowerCase()}"
      value="${genres[i]}"
    />
    <label for="${genres[i].toLowerCase()}">${genres[i]}</label>
    <br/>
    `;
    document
      .querySelector("#filter-form")
      .insertAdjacentHTML("beforeend", genresHtml);
  }

  async function getGenresFromArtists() {
    console.log("Get different genres from artists");
    const artists = await getArtists();

    let differentGenres = [];
    for (let i = 0; i < artists.length; i++) {
      for (let q = 0; q < artists[i].genres.length; q++) {
        if (!differentGenres.includes(artists[i].genres[q])) {
          differentGenres.push(artists[i].genres[q]);
        }
      }
    }
    return differentGenres;
  }
}
async function filterArtistsByGenre() {
  const artists = await getArtists();
  const selected = [];
  const inputs = document
    .querySelector("#filter-form")
    .querySelectorAll("input[type='checkbox']");

  for (const input of inputs) {
    if (input.checked) {
      selected.push(input.value);
    }
  }
  if (selected.length === 0) {
    updateArtGrid();
  } else {
    const filteredArtists = artists.filter((artist) => {
      return selected.some((genre) => artist.genres.includes(genre));
    });
    displayArtists(filteredArtists);
  }
}

async function sortArtists() {
  const dropdown = document.querySelector("#sort-select");
  const selected = dropdown.value;
  const artists = await getArtists();

  let sorted = null;
  switch (selected) {
    case "az":
      sorted = artists.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) return 1;
        return -1;
      });
      break;
    case "za":
      sorted = artists.sort((a, b) => {
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        return -1;
      });
      break;
    default:
      displayArtists(artists);
      break;
  }
  if (sorted) {
    displayArtists(sorted);
  }
}
