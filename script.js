const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const progressContainer = document.getElementById("progressContainer");
const progressBar = document.getElementById("progressBar");

let imgData, fileName = "image";

// Load uploaded image
upload.addEventListener("change", function() {
  const file = upload.files[0];
  fileName = file.name.split(".")[0]; // store original name
  const reader = new FileReader();

  reader.onload = function(event) {
    const img = new Image();
    img.onload = function() {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      imgData = ctx.getImageData(0, 0, img.width, img.height);
      canvas.classList.add("show"); // fade-in effect
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

// Show progress bar animation
function showProgress(callback) {
  progressContainer.style.display = "block";
  progressBar.style.width = "0%";

  let width = 0;
  const interval = setInterval(() => {
    if (width >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        progressContainer.style.display = "none";
        callback();
      }, 300);
    } else {
      width += 5;
      progressBar.style.width = width + "%";
    }
  }, 50);
}

// XOR encryption/decryption
function processImage(mode) {
  const key = document.getElementById("key").value;
  if (!key) {
    alert("⚠️ Enter a secret key!");
    return;
  }

  showProgress(() => {
    let data = imgData.data;
    for (let i = 0; i < data.length; i++) {
      data[i] = data[i] ^ key.charCodeAt(i % key.length);
    }

    ctx.putImageData(imgData, 0, 0);
    alert(`✅ Image ${mode}ed successfully!`);
  });
}

function encryptImage() {
  processImage("Encrypt");
}

function decryptImage() {
  processImage("Decrypt");
}

// Download image with dynamic filename
function downloadImage() {
  const link = document.createElement("a");
  link.download = `${fileName}-processed.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
