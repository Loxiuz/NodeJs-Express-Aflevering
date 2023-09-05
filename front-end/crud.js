const endpoint = "http://localhost:8080";

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
  form.addEventListener("submit", createArtist);
  document.querySelector("#cancel-btn").addEventListener("click", () => {
    location.reload();
  });

  function createArtist(event) {
    event.preventDefault();
    console.log("Creating Artist");
    document;
    form.removeEventListener("submit", createArtist);

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
    sendNewArtist();
    dialog.close();

    async function sendNewArtist() {
      console.log("Posting member");

      const res = await fetch(`${endpoint}/artists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newArtist),
      });
      if (res.ok) {
        console.log("Added artist successfully");
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
