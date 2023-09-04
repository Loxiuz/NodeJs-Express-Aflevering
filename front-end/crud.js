const endpoint = "http://localhost:8080";

async function getArtists() {
  const res = await fetch(`${endpoint}/artists`);
  return prepareData(res);

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

export default getArtists;
