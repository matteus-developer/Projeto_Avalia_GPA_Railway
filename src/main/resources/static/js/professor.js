// =============================
// Seletores para os campos do formulário
// (Sem alteração)
// =============================
const formProfessor = document.querySelector("#formProfessor");
const idNomeProfessor = document.querySelector("#idNomeProfessor"); 
const idEmailProfessor = document.querySelector("#idEmailProfessor");
const idSenhaProfessor = document.querySelector("#idSenhaProfessor");
const idMatriProfessor = document.querySelector("#idMatriProfessor"); 
const idTipoProfessor = document.querySelector("#idTipoProfessor");
const tabelaBody = document.querySelector("#tableDisciplina tbody"); 

// VARIÁVEL INJETADA PELO THYMELEAF (IS_COORDENADOR)
// Adicionamos uma verificação para garantir que exista
const isCoordenador = typeof IS_COORDENADOR !== 'undefined' ? IS_COORDENADOR : false;

// =============================
// Salvar Professor
// =============================
function salvarProfessor() {
    // Verificação de permissão no frontend
    if (!isCoordenador) {
        alert("Você não tem permissão para cadastrar professores.");
        return;
    }
    
    // ... restante da lógica de salvarProfessor() (sem alteração)
    
    if (
        idNomeProfessor.value === "" || 
        idEmailProfessor.value === "" || 
        idSenhaProfessor.value === "" || 
        idMatriProfessor.value === "" ||
        idTipoProfessor.value === ""
    ) {
        alert("Por favor, preencha todos os campos do professor.");
        return;
    }

    const tipo = parseInt(idTipoProfessor.value);

    if (tipo === 1) {
        fetch("/disciplina/list")
            .then(res => res.json())
            .then(disciplinas => {
                const idsDisciplinas = disciplinas.map(d => d.idDisciplina);

                const professorDTO = {
                    nomeProfessor: idNomeProfessor.value,
                    emailProfessor: idEmailProfessor.value,
                    senhaProfessor: idSenhaProfessor.value,
                    matriProfessor: idMatriProfessor.value,
                    tipoProfessor: tipo,
                    idsDisciplinas: idsDisciplinas
                };

                enviarProfessor(professorDTO);
            })
            .catch(err => console.error("Erro ao buscar disciplinas:", err));

    } else {
        const checkboxes = document.querySelectorAll(".check-disciplina:checked");
        const disciplinasSelecionadas = [...checkboxes].map(c => parseInt(c.value));

        const professorDTO = {
            nomeProfessor: idNomeProfessor.value,
            emailProfessor: idEmailProfessor.value,
            senhaProfessor: idSenhaProfessor.value,
            matriProfessor: idMatriProfessor.value,
            tipoProfessor: tipo,
            idsDisciplinas: disciplinasSelecionadas
        };

        enviarProfessor(professorDTO);
    }
}

// ... (enviarProfessor, limparCamposProfessor, listarDisciplinas, Filtros)

// =============================
// Excluir Professor
// =============================
document.addEventListener("click", function (event) {
    
    // Bloqueia a ação se não for Coordenador (redundante, mas seguro)
    if (!isCoordenador) return; 

    if (event.target.classList.contains("btn-excluir")) {

        const idProfessor = event.target.getAttribute("data-id");

        const senha = prompt("Digite a senha para confirmar a exclusão:");
        if (!senha) {
            alert("Exclusão cancelada. Senha não informada.");
            return;
        }

        const senhaCorreta = "fatecGRU2025@#";
        if (senha !== senhaCorreta) {
            alert("Senha incorreta! Exclusão não autorizada.");
            return;
        }

        if (confirm("Tem certeza que deseja excluir este professor?")) {

            fetch(`/professor/excluir/${idProfessor}`, {
                method: "DELETE"
            })
            .then(res => {
                // ... (tratamento de resposta, incluindo 403 Forbidden)
                if (res.ok) {
                    alert("Professor excluído com sucesso!");
                    listarProfessores();
                } else if (res.status === 404) {
                    alert("Professor não encontrado!");
                } else if (res.status === 403) {
                     alert("Acesso Negado. Você não tem permissão para excluir.");
                } else {
                    alert("Erro ao excluir professor.");
                }
            })
            .catch(err => console.error("Erro ao excluir:", err));
        }
    }
});


// =============================
// Listar Professores
// =============================
function listarProfessores() {
    fetch("/professor/list")
        .then(res => {
            if (res.status === 403) {
                // Usuário não é Coordenador. A listagem de todos é negada.
                const tbody = document.querySelector("#tableProfessor tbody");
                tbody.innerHTML = "<tr><td colspan='5'>Acesso restrito. Apenas Coordenadores podem listar todos os professores.</td></tr>";
                // Limpa o conteúdo da tabela se não for Coordenador, conforme configurado no SecurityConfig
                return Promise.reject("Acesso negado."); 
            }
            if (!res.ok) {
                throw new Error(`Erro ao buscar professores: ${res.status}`);
            }
            return res.json();
        })
        .then(professores => {
            const tbody = document.querySelector("#tableProfessor tbody");
            tbody.innerHTML = "";

            professores.forEach(p => {
                const tipoTexto = p.tipoProfessor === 1 ? "Coordenador" : "Professor";

                // Ações de Edição/Exclusão só são mostradas se for Coordenador
                const actionsHtml = isCoordenador ? `
                    <button class="btn-editar" data-id="${p.idProfessor}">Editar</button>
                    <button class="btn-excluir" data-id="${p.idProfessor}">Excluir</button>
                ` : 'N/A';

                const linha = document.createElement("tr");
                linha.innerHTML = `
                    <td>${p.idProfessor}</td>
                    <td>${p.nomeProfessor}</td>
                    <td>${p.matriProfessor}</td>                 
                    <td>${tipoTexto}</td>
                    <td>${actionsHtml}</td>
                `;
                tbody.appendChild(linha);
            });
        })
        .catch(err => console.error("Erro ao listar professores:", err));
}

// =============================
// Abrir modal de edição
// =============================
document.addEventListener("click", function (event) {
    
    // Bloqueia a ação se não for Coordenador
    if (!isCoordenador) return;

    if (event.target.classList.contains("btn-editar")) {

        const idProfessor = event.target.getAttribute("data-id");

        // ... (restante da lógica de busca e preenchimento do modal)
        fetch(`/professor/${idProfessor}`)
            .then(res => res.json())
            .then(professor => {

                document.querySelector("#editIdProfessor").value = professor.idProfessor;
                document.querySelector("#editNomeProfessor").value = professor.nomeProfessor;
                document.querySelector("#editEmailProfessor").value = professor.emailProfessor;
                document.querySelector("#editSenhaProfessor").value = professor.senhaProfessor;
                document.querySelector("#editMatriProfessor").value = professor.matriProfessor;
                document.querySelector("#editTipoProfessor").value = professor.tipoProfessor;

                fetch("/disciplina/list")
                    .then(res => res.json())
                    .then(disciplinas => {

                        const container = document.querySelector("#editListaDisciplinas");
                        container.innerHTML = "";

                        disciplinas.forEach(d => {
                            const checked = professor.disciplinas.some(pd => pd.idDisciplina === d.idDisciplina);

                            const div = document.createElement("div");
                            div.innerHTML = `
                                <label>
                                    <input type="checkbox" class="edit-check-disciplina" value="${d.idDisciplina}" ${checked ? "checked" : ""}>
                                    ${d.nomeDisciplina}
                                </label>
                            `;
                            container.appendChild(div);
                        });

                        document.querySelector("#modalEditar").style.display = "flex";

                    });
            })
            .catch(err => console.error("Erro ao buscar professor:", err));
    }
});

// =============================
// Atualizar Professor
// =============================
document.querySelector("#formEditarProfessor").addEventListener("submit", function (event) {
    event.preventDefault();
    
    // Bloqueia a ação se não for Coordenador
    if (!isCoordenador) {
        alert("Você não tem permissão para atualizar dados de professores.");
        return;
    }
    
    const id = document.querySelector("#editIdProfessor").value;
    const idsDisciplinas = [...document.querySelectorAll(".edit-check-disciplina:checked")].map(c => parseInt(c.value));

    const dto = {
        nomeProfessor: document.querySelector("#editNomeProfessor").value,
        emailProfessor: document.querySelector("#editEmailProfessor").value,
        senhaProfessor: document.querySelector("#editSenhaProfessor").value,
        matriProfessor: document.querySelector("#editMatriProfessor").value,
        tipoProfessor: parseInt(document.querySelector("#editTipoProfessor").value),
        idsDisciplinas: idsDisciplinas
    };

    fetch(`/professor/atualizar/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dto)
    })
    .then(res => {
        if (res.ok) {
            alert("Professor atualizado com sucesso!");
            document.querySelector("#modalEditar").style.display = "none";
            listarProfessores();
        } else if (res.status === 403) {
            // Se o backend retornou 403 (e não deveria, pois o coordenador deveria ter acesso)
            // ou se for um professor comum que conseguiu chegar aqui.
            alert("Acesso Negado. Você não tem permissão para editar este perfil.");
        } else {
            alert("Erro ao atualizar professor.");
        }
    })
    .catch(err => console.error("Erro:", err));
});

// ... (restante do código: Fechar modal, Event Listeners, Botão Voltar)

//=====================================================================
// Event Listeners
//=====================================================================
formProfessor.addEventListener('submit', function(event) {
    event.preventDefault();
    salvarProfessor(); 
});

document.addEventListener("DOMContentLoaded", () => {
    // A listagem de disciplinas é sempre liberada, pois o front não tem como saber o URL da API
    listarDisciplinas(); 
    // A listagem de professores agora é restrita.
    listarProfessores();
});

//=====================================================================
// Botão para voltar ao menu
//=====================================================================
document.getElementById("btnVoltar").onclick = () => {
    window.location.href = "/menu";
};
