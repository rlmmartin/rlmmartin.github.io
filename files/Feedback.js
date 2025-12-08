// This script handles the interactive star rating feature on the feedback form

const stars = document.querySelectorAll('.star');
let rating = 0; // Starts the rating at zero

stars.forEach(star => {
  star.addEventListener('click', () => {
    rating = star.dataset.value;
    // Okay, now we highlight all the stars up to the one that was clicked!
    stars.forEach(s => s.classList.toggle('active', s.dataset.value <= rating));

  });
});


