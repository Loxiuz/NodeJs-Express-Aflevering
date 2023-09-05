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
  createArtistClicked,
  getArtists,
  updateArtistClicked,
  deleteArtistClicked,
};
