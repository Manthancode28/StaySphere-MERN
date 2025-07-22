(() => {
    'use strict'

    const forms = document.querySelectorAll('.needs-validation')

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})

let filterList = document.querySelector("#filters");
let navbar = document.querySelector(".container-fluid");
let togglerBtn = document.querySelector(".navbar-toggler");
console.log(togglerBtn);
togglerBtn.addEventListener("click", () => {
    togglerBtn.classList.add("newTogglerBtn");
    if (filterList.classList.contains("newFilterList")) {
        filterList.classList.remove("newFilterList");
    } else {
        filterList.classList.add("newFilterList");
    }
    navbar.classList.add("newNavbar");
})