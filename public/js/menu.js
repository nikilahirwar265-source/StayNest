
const menuContainer = document.getElementById("menu-Container");
console.log(menuContainer);
const menuIcon = document.getElementById("menu-bar");
console.log(menuIcon);
menuIcon.addEventListener("click", () => {
    console.log("button was clickd");
    menuContainer.classList.toggle("opacity");
});

