const endpoint = "http://localhost:8080";

/* When the button for adding artist is clicked */
function createArtistClicked() {
  console.log("Add Artist");
  document
    .querySelector("#create-btn")
    .removeEventListener("click", createArtistClicked);

  const dialog = document.querySelector("#createAndUpdateDialog");
  dialog.showModal();
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
  });

  const form = document.querySelector("#createAndUpdateForm");
  document;
  form.reset(); //create form
  form.addEventListener("submit", createArtist);
  document.querySelector("#cancel-btn").addEventListener("click", () => {
    location.reload();
  });
  /* Creates the artist based on the input in the form */
  function createArtist(event) {
    event.preventDefault();
    console.log("Creating Artist");
    document;
    form.removeEventListener("submit", createArtist);

    const newArtist = {
      name: form.name.value,
      birthdate: form.birthdate.value,
      activeSince: form.activeSince.value,
      genres: convertGenresToArray(form.genres.value),
      labels: form.labels.value,
      website: form.website.value,
      image: form.image.value,
      shortDescription: form.shortDescription.value,
      isFavorite: false,
    };
    console.log(newArtist);
    sendNewArtist();
    dialog.close();
    /* Sends the new artist to the server with POST */
    async function sendNewArtist() {
      console.log("Posting member");
      //Gets the data from the correct route using POST
      const res = await fetch(`${endpoint}/artists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newArtist),
      });
      if (res.ok) {
        //Checks if the response is successful or not
        console.log("Added artist successfully");
      } else {
        console.log("Error with post response from server");
      }
    }
  }
}
/* Converts given genres from string to array 
  (Used for converting the input from the form) */
function convertGenresToArray(genres) {
  return genres.split(",").map((genre) => genre.trim());
}
/* Gets and parses data from the server */
async function getArtists() {
  const res = await fetch(`${endpoint}/artists`);
  const data = await res.json();
  return data;
}
/* Shows editing form and updates the edited artist */
function updateArtistClicked(artist) {
  console.log(`Editing: ${artist.name}`);
  document
    .querySelector("#artists-grid .artists-grid-item:last-child #update-btn")
    .removeEventListener("click", () => {
      updateArtistClicked(artist);
    });
  //Fills the form with the current values to make easier to edit
  const form = document.querySelector("#createAndUpdateForm");
  form.name.value = artist.name;
  form.birthdate.value = artist.birthdate;
  form.activeSince.value = artist.activeSince;
  form.genres.value = artist.genres;
  form.labels.value = artist.labels;
  form.website.value = artist.website;
  form.image.value = artist.image;
  form.shortDescription.value = artist.shortDescription;

  const dialog = document.querySelector("#createAndUpdateDialog");
  dialog.showModal();
  dialog.addEventListener("cancel", (event) => {
    // Prevents the dialog closing when pressing escape
    // to make sure it doesn't send multiple requests at the same time
    event.preventDefault();
  });

  form.addEventListener("submit", updateArtist);
  document.querySelector("#cancel-btn").addEventListener("click", () => {
    location.reload();
  });
  /* Updates the edited artist and sends the object to the server */
  function updateArtist(event) {
    event.preventDefault();
    console.log("update artist");

    form.removeEventListener("submit", updateArtist);
    //Updated artist object
    const updatedArtist = {
      name: form.name.value,
      birthdate: form.birthdate.value,
      activeSince: form.activeSince.value,
      genres: convertGenresToArray(form.genres.value),
      labels: form.labels.value,
      website: form.website.value,
      image: form.image.value,
      shortDescription: form.shortDescription.value,
      isFavorite: artist.isFavorite,
    };
    sendUpdatedArtist();
    /* Sends the updated artist object the server usind PUT */
    async function sendUpdatedArtist() {
      console.log(`Updating: ${artist.name}`);
      console.log(updatedArtist);

      const res = await fetch(`${endpoint}/artists/${artist.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedArtist),
      });
      if (res.ok) {
        //Checks if the response was successful or not
        console.log("Update successfull");
      } else {
        console.log("Failed to update");
      }
    }
  }
}
/* Sets the "favorite" parameter to a given boolean in a given artist object */
async function setArtistFavorit(artist, isFavorite) {
  console.log(artist.name + " Added to favourites");

  let updated;
  if (isFavorite) {
    updated = {
      isFavorite: true,
    };
  } else {
    updated = {
      isFavorite: false,
    };
  }
  // Sends the updated parameter as an object and use
  // PUT to update the data in the server
  const res = await fetch(`${endpoint}/artists/${artist.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated),
  });
  if (res.ok) {
    console.log("Update successfull");
  } else {
    console.log("Failed to update");
  }
}
/* Deletes a given artist */
function deleteArtistClicked(artist) {
  console.log(`Delete: ${artist.name}`);
  document
    .querySelector("#artists-grid .artists-grid-item:last-child #delete-btn")
    .removeEventListener("click", () => {
      deleteArtistClicked(artist);
    });
  //Confirmation dialog
  const dialog = document.querySelector("#deleteDialog");
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
  /* Sends a delete request with the id of the given artist */
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
  createArtistClicked,
  getArtists,
  updateArtistClicked,
  setArtistFavorit,
  deleteArtistClicked,
};
