import {
  getArtists,
  createArtistClicked,
  updateArtistClicked,
  deleteArtistClicked,
} from "../crud.js";

("use strict");

window.addEventListener("load", start);

const favorites = [];

function start() {
  updateArtGrid();
  makeFilterCheckboxes();
  document
    .querySelector("#favorites-btn")
    .addEventListener("click", favoritesClicked);
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
            <p id = "name">${artist.name}</p>
            <p id = "genres">${artist.genres}</p>
            <button id="update-btn">Redigér</button>
            <button id="delete-btn">Slet</button>
            <button id="addToFav-btn">Føj til favoritter</button>
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
    document
      .querySelector(
        "#artists-grid .artists-grid-item:last-child #addToFav-btn"
      )
      .addEventListener("click", () => {
        addArtistToFavorite(artist);
      });
  }

  artists.forEach(displayArtist);
}

async function updateArtGrid() {
  console.log("Updated Artists Grid");
  const artists = await getArtists();
  displayArtists(artists);
}

function addArtistToFavorite(artist) {
  console.log(artist.name + " Added to favourites");
  if (!favorites.includes(artist.id)) {
    favorites.push(artist.id);
  }
  console.log(favorites);
}

function favoritesClicked() {
  console.log("Showing favorites");
  document
    .querySelector("#favorites-btn")
    .removeEventListener("click", favoritesClicked);
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
    filterArtistsByGenre();

    function filterArtistsByGenre() {
      document.querySelector("#filter-form").addEventListener("change", () => {
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
      });
    }

    return differentGenres;
  }
}
