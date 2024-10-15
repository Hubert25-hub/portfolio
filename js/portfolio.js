document.addEventListener("DOMContentLoaded", function() {
    const descriptionPopup = document.getElementById("descriptionPopup");
    const images = document.querySelectorAll(".gallery img");
  images.forEach(image => {
        image.addEventListener("click", function(event) {
            const description = this.getAttribute("data-description");
            descriptionPopup.textContent = description;
            descriptionPopup.style.display = "block";
            const rect = this.getBoundingClientRect();
            descriptionPopup.style.left = `${rect.left + window.scrollX}px`;
            descriptionPopup.style.top = `${rect.bottom + window.scrollY}px`;
            setTimeout(() => {
                descriptionPopup.style.display = "none";
            }, 9000);
        });
    });
});
