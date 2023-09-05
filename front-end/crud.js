const endpoint = "http://localhost:8080";

function createArtistClicked() {
  console.log("Add Artist");
  document
    .querySelector("#create-btn")
    .removeEventListener("click", createArtistClicked);

  const dialog = document.querySelector("#createAndUpdateDialog");
  dialog.showModal();
  dialog.addEventListener("cancel", (event) => {
    /*Prevents the dialog closing when pressing escape 
   to make sure it doesn't send multiple requests at the same time  */
    event.preventDefault();
  });
  const form = document.querySelector("#createAndUpdateForm");
  document
    .querySelector("#confirm-btn")
    .addEventListener("click", createArtist);
  document.querySelector("#cancel-btn").addEventListener("click", () => {
    location.reload();
  });

  function createArtist() {
    console.log("Creating Artist");
    document
      .querySelector("#confirm-btn")
      .removeEventListener("click", createArtist);

    const newArtist = {
      name: form.name.value,
      birthdate: form.birthdate.value,
      activeSince: form.activeSince.value,
      genres: form.genres.value,
      labels: form.labels.value,
      website: form.website.value,
      image: form.image.value,
      shortDescription: form.shortDescription.value,
      isBand: isBandChecked(),
    };
    function isBandChecked() {
      return form.querySelector("input[type='checkbox']").checked;
    }
    console.log(newArtist);
    sendNewArtist(newArtist);
    dialog.close();

    async function sendNewArtist(newArtist) {
      console.log("Posting member");

      const res = await fetch(`${endpoint}/artists`, {
        method: "POST",
        body: newArtist,
      });
      if (res.ok) {
        console.log("Added artist successfully");
        location.reload();
      } else {
        console.log("Error with post response from server");
      }
    }
  }
}

async function getArtists() {
  const res = await fetch(`${endpoint}/artists`);
  const data = await res.json();
  return prepareData(data);

  function prepareData(data) {
    const dataArr = [];
    for (const key in data) {
      const dataObject = data[key];
      dataArr.push(dataObject);
    }
    return dataArr;
  }
}

function updateArtistClicked(artist) {
  console.log(`Editing: ${artist.name}`);
  document
    .querySelector("#artists-grid .artists-grid-item:last-child #update-btn")
    .removeEventListener("click", () => {
      updateArtistClicked(artist);
    });
}

function deleteArtistClicked(artist) {
  console.log(`Delete: ${artist.name}`);
  document
    .querySelector("#artists-grid .artists-grid-item:last-child #delete-btn")
    .removeEventListener("click", () => {
      deleteArtistClicked(artist);
    });
}

export {
  createArtistClicked,
  getArtists,
  updateArtistClicked,
  deleteArtistClicked,
};
