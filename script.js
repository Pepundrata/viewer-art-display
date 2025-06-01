const API_URL = "https://your-bot-api-url/images.json"; // <-- change to your actual API endpoint

const numImagesInput = document.getElementById("numImages");
const randomToggle = document.getElementById("randomToggle");
const modeSelect = document.getElementById("modeSelect");
const refreshBtn = document.getElementById("refreshBtn");
const imageContainer = document.getElementById("imageContainer");

let images = [];
let loopInterval = null;
let currentLoopIndex = 0;

async function fetchImages() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    images = data.map(item => item.url);
    if (images.length === 0) {
      imageContainer.innerHTML = "<p>No images yet.</p>";
      return false;
    }
    return true;
  } catch (err) {
    console.error("Error fetching images:", err);
    imageContainer.innerHTML = "<p>Error fetching images.</p>";
    return false;
  }
}

function getRandomSubset(arr, n) {
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

function showStaticImages() {
  clearInterval(loopInterval);
  imageContainer.innerHTML = "";

  let toShow = images;

  if (randomToggle.checked) {
    toShow = getRandomSubset(images, Math.min(numImagesInput.value, images.length));
  } else {
    toShow = images.slice(0, numImagesInput.value);
  }

  toShow.forEach(url => {
    const img = document.createElement("img");
    img.src = url;
    imageContainer.appendChild(img);
  });
}

function showLoopingImages() {
  clearInterval(loopInterval);
  imageContainer.innerHTML = "";

  const count = Math.min(numImagesInput.value, images.length);

  if (count === 0) {
    imageContainer.innerHTML = "<p>No images to show.</p>";
    return;
  }

  let toShow = images;

  if (randomToggle.checked) {
    toShow = getRandomSubset(images, images.length);
  }

  currentLoopIndex = 0;
  imageContainer.innerHTML = "";
  const img = document.createElement("img");
  img.src = toShow[currentLoopIndex];
  imageContainer.appendChild(img);

  loopInterval = setInterval(() => {
    currentLoopIndex = (currentLoopIndex + 1) % toShow.length;
    img.src = toShow[currentLoopIndex];
  }, 4000); // Change every 4 seconds
}

async function refresh() {
  const success = await fetchImages();
  if (!success) return;

  if (modeSelect.value === "static") {
    showStaticImages();
  } else {
    showLoopingImages();
  }
}

refreshBtn.addEventListener("click", refresh);

window.onload = refresh;
