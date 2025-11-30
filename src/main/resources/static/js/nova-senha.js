// /js/alterar-senha.js
document.addEventListener("DOMContentLoaded", () => {
    const senha = document.getElementById("senha");
    const confirmar = document.getElementById("confirmar");

    confirmar.addEventListener("input", () => {
        if (confirmar.value !== senha.value) {
            confirmar.style.borderColor = "red";
        } else {
            confirmar.style.borderColor = "";
        }
    });
});
