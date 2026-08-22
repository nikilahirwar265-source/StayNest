const filtersContainer = document.getElementById("filtersContainer");
const scrollBtn = document.getElementById("scrollBtn");

scrollBtn.addEventListener("click", () => {
    filtersContainer.scrollBy({
        left: 300,
        behavior: "smooth"
    });
});