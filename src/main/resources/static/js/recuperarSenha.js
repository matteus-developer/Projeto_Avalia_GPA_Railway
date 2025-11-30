document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("formRecuperarSenha");
    const emailInput = document.getElementById("email");
    const matriculaInput = document.getElementById("matricula");

    form.addEventListener("submit", (e) => {

        // Verifica campos vazios
        if (emailInput.value.trim() === "" || matriculaInput.value.trim() === "") {
            e.preventDefault();
            alert("Preencha todos os campos!");
            return;
        }

        // Validação básica de email
        if (!emailInput.value.includes("@") || !emailInput.value.includes(".")) {
            e.preventDefault();
            alert("Digite um e-mail válido!");
            return;
        }

        // Aqui o backend valida se email + matrícula existem
        // Não bloqueamos -> o Spring fará a verificação correta
    });

});


