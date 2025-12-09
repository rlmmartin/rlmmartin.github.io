const slider = document.getElementById("Images");
//Variable that starts from the first slide
let index = 0;

function move(step) {
  const total = slider.children.length;
  index = (index + step + total) % total;
  // does a sliding animation after you click the arrow
  slider.style.transform = `translateX(-${index * 100}%)`;
}
//Goes to the next 
document.getElementById("next").onclick = () => move(1);
//Goes to the previous 
document.getElementById("prev").onclick = () => move(-1);