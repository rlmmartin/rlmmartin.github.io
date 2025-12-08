const slider = document.getElementById("Images");
let index = 0;

function move(step) {
  const total = slider.children.length;
  index = (index + step + total) % total;
  slider.style.transform = `translateX(-${index * 100}%)`;
}

document.getElementById("next").onclick = () => move(1);
document.getElementById("prev").onclick = () => move(-1);