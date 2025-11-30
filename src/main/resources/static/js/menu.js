document.addEventListener("DOMContentLoaded", () => {

	//======================================================================
    // Gerenciar Questões
	//======================================================================
    document.getElementById("btnGerenciar")?.addEventListener("click", async () => {
        try {
            const response = await fetch("/tela/gerenciar/questao");
            if (response.ok) window.location.href = "/tela/gerenciar/questao";
            else alert("Não foi possível abrir a tela de gerenciamento.");
        } catch (error) {
            console.error("Erro ao chamar a tela de gerenciamento:", error);
            alert("Erro ao conectar com o servidor.");
        }
    });

	//======================================================================
    // Gerar Prova
	//======================================================================
    document.getElementById("btnGerarProva")?.addEventListener("click", () => {
        window.location.href = "/tela/prova";
    });

	//======================================================================
    // Cadastrar Questões
	//======================================================================
    document.getElementById("btnCadastrar")?.addEventListener("click", () => {
        window.location.href = "/tela/cadastrar/questao";
    });

	//======================================================================
    // Gerenciar Professor (apenas existe para coordenador)
	//======================================================================
    document.getElementById("btnGerenciarProfessor")?.addEventListener("click", () => {
        window.location.href = "/tela/professor";
    });

	//======================================================================
    // Gerenciar Disciplina (apenas existe para coordenador)
	//======================================================================
    document.getElementById("btnGerenciarDisciplina")?.addEventListener("click", () => {
        window.location.href = "/tela/disciplina";
    });

	//======================================================================
    // Sair (sempre existe)
	//======================================================================
    document.getElementById("btnSair")?.addEventListener("click", () => {
        window.location.href = "/tela/logout";
    });

});
