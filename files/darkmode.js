const darkmode = document.getElementById("darkMode");
const lightmode = document.getElementById("lightMode");

let theme = localStorage.getItem("theme");

if (theme && theme ===  "dark") {
    document.body.classList.add("dark-mode");
}

darkmode.addEventListener("click", function (){
    document.body.classList.add("dark-mode");

    localStorage.setItem("theme","dark");
});

lightmode.addEventListener("click", function (){
    document.body.classList.remove("dark-mode");

    localStorage.setItem("theme","light");
});