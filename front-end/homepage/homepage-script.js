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
  updateArtGrid(); // To show to latest version of the data
  makeFilterCheckboxes(); //Generate the checkboxes for the filter
  document //When "show favorites" is clicked
    .querySelector("#favorites-btn")
    .addEventListener("change", favoritesClicked);
  document // When "Add Artist" is clicked
    .querySelector("#create-btn")
    .addEventListener("click", createArtistClicked);
  document //When any filter category is clicked
    .querySelector("#filter-form")
    .addEventListener("change", filterArtistsByGenre);
  document //When a value for sort is chosen
    .querySelector("#sort-select")
    .addEventListener("change", sortArtists);
}
/* Display a given artists array */
function displayArtists(artists) {
  console.log("Displaying artists");
  console.log(artists);
  document.querySelector("#artists-grid").innerHTML = ""; //Clear html to avoid duplication
  /* Display a given artist */
  function displayArtist(artist) {
    //Inserts a given artist into the HTML
    document.querySelector("#artists-grid").insertAdjacentHTML(
      "beforeend",
      /* html */ `
        <div class="artists-grid-item">
            <img src=${artist.image}>
            <h2 id = "name">${artist.name}</h2>
            <h3 id = "genres">${showGenres(artist.genres)}</h3>
            <button id="update-btn">Redigér</button>
            <button id="delete-btn">Slet</button>
        </div>
  `
    );
    //Event listeners for the buttons on the artist
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
    //If the artist is already added to favorites
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
      //If the artist is not in favorites
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
  //Shows every artist in given artists array
  artists.slice().reverse().forEach(displayArtist); //In reverse to set the latest artist added first
}
/* Updates the grid for artists */
async function updateArtGrid() {
  console.log("Updated Artists Grid");
  const artists = await getArtists();
  displayArtists(artists);
}
/* When "show favorites" checkbox is clicked */
async function favoritesClicked() {
  console.log("Showing favorites");
  document
    .querySelector("#favorites-btn")
    .removeEventListener("click", favoritesClicked);

  const checkbox = document.querySelector("#favorites-btn");
  //If the checkbox is clicked - get artists who are favorite (where artist.isFavorite = true)
  if (checkbox.checked) {
    const artists = await getArtists();
    const favorites = artists.filter((artist) => {
      return artist.isFavorite === true;
    });
    displayArtists(favorites); //Display favorites
  } else {
    updateArtGrid(); //If the favorites is unchecked
  }
}
/* Converts the genres array to a single readable string */
function showGenres(genres) {
  let genresString = "";
  for (let i = 0; i < genres.length; i++) {
    if (i > 0) genresString += ` - ${genres[i]}`;
    else genresString += `${genres[i]}`;
  }
  return genresString;
}
/* When the image for an artist is clicked */
function imageClicked(artist) {
  console.log("Showing details");
  document
    .querySelector("#artists-grid .artists-grid-item:last-child img")
    .removeEventListener("click", () => {
      imageClicked(artist);
    });

  const dialog = document.querySelector("#detailedArtistDialog");
  dialog.innerHTML = ""; //Clear html to avoid duplication
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
      <li>${showGenres(artist.genres)}</li>
      <li>${artist.labels}</li>
      <li>${artist.website}</li>
    </ul>
  `
  );
  //Show dialog
  dialog.classList.remove("hidden");
  dialog.showModal();
  document.querySelector("#close-details-btn").addEventListener("click", () => {
    dialog.classList.add("hidden");
    dialog.close();
  });
}
/* Makes the checkboxes for the filter based on the categories from all artists */
async function makeFilterCheckboxes() {
  console.log("Creation of filter checkboxes");
  const genres = await getGenresFromArtists(); //Get all the different genres from artists
  for (let i = 0; i < genres.length; i++) {
    //Cycles through the genres and shows them with html
    const genresHtml = /* html */ `
    <div id="checkboxes">
    <label for="${genres[i].toLowerCase()}">${genres[i]}</label>
      <input 
        type="checkbox" 
        name="genre" 
        id="${genres[i].toLowerCase()}"
        value="${genres[i]}"
      />
    </div>
    
    `;
    document //Inserted in the html element
      .querySelector("#filter-form")
      .insertAdjacentHTML("beforeend", genresHtml);
  }
  /* Returns an array with all the different genres from the artists */
  async function getGenresFromArtists() {
    console.log("Get different genres from artists");
    const artists = await getArtists();

    let differentGenres = []; //Array with different genres
    //Cycles through the artists
    for (let i = 0; i < artists.length; i++) {
      //Cycles through the genre for that artist[i]
      for (let q = 0; q < artists[i].genres.length; q++) {
        //Checks if the array already contains that genre(.genres[q]) to avoid duplication
        if (!differentGenres.includes(artists[i].genres[q])) {
          differentGenres.push(artists[i].genres[q]); //Push genre
        }
      }
    }
    return differentGenres;
  }
}
/* Filters the artists based on checked checkboxes */
async function filterArtistsByGenre() {
  console.log("Filtering artists by genre");
  const artists = await getArtists();
  const inputs = document //Array with all the checkboxes
    .querySelector("#filter-form")
    .querySelectorAll("input[type='checkbox']");
  const selected = []; //Array for the selected checkboxes

  for (const input of inputs) {
    //Cycle through all checkboxes
    if (input.checked) {
      //Check if checkbox is check
      selected.push(input.value); //Push to selected
    }
  }

  if (selected.length === 0) {
    //If there is none selected
    updateArtGrid();
  } else {
    //Array with the filtered artists
    const filteredArtists = artists.filter((artist) => {
      //Returns true if an artist has one of the selected genres
      return selected.some((genre) => artist.genres.includes(genre));
    });
    displayArtists(filteredArtists); //Display the filtered artists
  }
}
/* Sorts the artists based on the chosen value from the dropdown menu */
async function sortArtists() {
  const dropdown = document.querySelector("#sort-select");
  const selected = dropdown.value;
  const artists = await getArtists();

  let sorted = null;
  switch (selected) {
    case "az":
      sorted = artists.sort((a, b) => {
        //Alphabetical
        if (a.name.toLowerCase() > b.name.toLowerCase()) return -1;
        return 1;
      });
      break;
    case "za":
      sorted = artists.sort((a, b) => {
        //Reverse alphabetical
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        return 1;
      });
      break;
    default:
      displayArtists(artists); //If nothing is chosen (default)
      break;
  }
  if (sorted) {
    displayArtists(sorted); //Display sorted artists array
  }
}
