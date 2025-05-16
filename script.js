const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const palette = document.getElementById('palette');
const exportBtn = document.getElementById('export');

const width = 512;
const height = 512;

// Initialisation de la grille
let pixels = new Array(width * height).fill('#000000');

// Palette de couleurs de base
const colors = ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
let selectedColor = colors[0];

// Création des boutons de la palette
colors.forEach(color => {
  const swatch = document.createElement('div');
  swatch.className = 'color';
  swatch.style.backgroundColor = color;
  swatch.addEventListener('click', () => {
    selectedColor = color;
    document.querySelectorAll('.color').forEach(el => el.classList.remove('selected'));
    swatch.classList.add('selected');
  });
  palette.appendChild(swatch);
});
document.querySelector('.color').classList.add('selected');

// Chargement depuis localStorage
function loadPixels() {
  const saved = localStorage.getItem('pixelData');
  if (saved) {
    try {
      pixels = JSON.parse(saved);
    } catch (e) {
      console.error("Erreur de JSON :", e);
    }
  }
}

// Sauvegarde automatique
function savePixels() {
  localStorage.setItem('pixelData', JSON.stringify(pixels));
}

// Dessin des pixels
function drawPixels() {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      ctx.fillStyle = pixels[y * width + x];
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

// Gestion du clic
canvas.addEventListener('mousedown', e => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left));
  const y = Math.floor((e.clientY - rect.top));
  const index = y * width + x;
  if (index >= 0 && index < pixels.length) {
    pixels[index] = selectedColor;
    ctx.fillStyle = selectedColor;
    ctx.fillRect(x, y, 1, 1);
    savePixels();
  }
});

// Export JSON
exportBtn.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(pixels)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pixels.json';
  a.click();
});

// Lancement
loadPixels();
drawPixels();
