document.addEventListener("DOMContentLoaded", function() {
	const form = document.getElementById("loginForm");

	form.addEventListener("submit", function(event) {
		const matricula = document.getElementById("matriProfessor").value.trim();
		const senha = document.getElementById("senhaProfessor").value.trim();

		if (matricula === "" || senha === "") {
			event.preventDefault();
			alert("Preencha todos os campos!");
		}
		
	});
});