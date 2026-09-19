const cards = Array.from(document.querySelectorAll('.card button'));
const viewer = document.getElementById('viewer');
const img = document.getElementById('viewerImg');
const title = document.getElementById('viewerTitle');
const desc = document.getElementById('viewerDesc');
const count = document.getElementById('viewerCount');
let current = 0;

function show(i) {
  current = (i + cards.length) % cards.length;
  const button = cards[current];
  const thumb = button.querySelector('img');
  img.src = thumb.src;
  img.alt = thumb.alt;
  title.textContent = button.dataset.title;
  desc.textContent = button.dataset.description;
  count.textContent = (current + 1) + ' of ' + cards.length;
}

cards.forEach((button, i) => {
  button.addEventListener('click', () => {
    show(i);
    viewer.showModal();
  });
});

document.getElementById('viewerPrev').addEventListener('click', () => show(current - 1));
document.getElementById('viewerNext').addEventListener('click', () => show(current + 1));
document.getElementById('viewerClose').addEventListener('click', () => viewer.close());

// Click outside the box to close
viewer.addEventListener('click', (e) => {
  if (e.target === viewer) viewer.close();
});

// Arrow keys move between designs (Esc closes by default)
document.addEventListener('keydown', (e) => {
  if (!viewer.open) return;
  if (e.key === 'ArrowLeft') show(current - 1);
  if (e.key === 'ArrowRight') show(current + 1);
});
