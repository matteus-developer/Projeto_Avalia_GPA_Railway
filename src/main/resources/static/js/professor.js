// =============================
// Seletores para os campos do formulário
// =============================
const formProfessor = document.querySelector("#formProfessor");
const idNomeProfessor = document.querySelector("#idNomeProfessor"); 
const idEmailProfessor = document.querySelector("#idEmailProfessor");
const idSenhaProfessor = document.querySelector("#idSenhaProfessor");
const idMatriProfessor = document.querySelector("#idMatriProfessor"); 
const idTipoProfessor = document.querySelector("#idTipoProfessor");
const tabelaBody = document.querySelector("#tableDisciplina tbody"); 

// =============================
// Salvar Professor
// =============================
function salvarProfessor() {

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

//=====================================================================
// Função para enviar o professor ao backend
//=====================================================================
function enviarProfessor(professorDTO) {
    fetch("/professor/salvar", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        },
        method: "POST", 
        body: JSON.stringify(professorDTO) 
    })
    .then(res => {
        if (res.ok) return res.json();
        if (res.status === 400) {
            return res.text().then(msg => {
                alert(msg);
                throw new Error("Erro de validação.");
            });
        }
        alert("Erro ao salvar professor.");
        throw new Error("Falha na requisição.");
    })
    .then(professorSalvo => {
        alert(`Professor ${professorSalvo.nomeProfessor} (ID: ${professorSalvo.idProfessor}) salvo com sucesso!`);
        limparCamposProfessor();
        listarProfessores();
    })
    .catch(err => console.error("Erro:", err));
}

// =============================
// Excluir Professor
// =============================
document.addEventListener("click", function (event) {

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
                if (res.ok) {
                    alert("Professor excluído com sucesso!");
                    listarProfessores();
                } else if (res.status === 404) {
                    alert("Professor não encontrado!");
                } else {
                    alert("Erro ao excluir professor.");
                }
            })
            .catch(err => console.error("Erro ao excluir:", err));
        }
    }
});

// =============================
// Limpar Campos
// =============================
function limparCamposProfessor() {
    idNomeProfessor.value = "";
    idEmailProfessor.value = "";
    idSenhaProfessor.value = "";
    idMatriProfessor.value = "";
    idTipoProfessor.value = "";
    document.querySelectorAll(".check-disciplina").forEach(c => c.checked = false);
}

// =============================
// Listar Disciplinas
// =============================
function listarDisciplinas() {
    fetch("/disciplina/list")
        .then(res => res.json())
        .then(disciplinas => {
            tabelaBody.innerHTML = "";

            disciplinas.forEach(d => {
                const linha = document.createElement("tr");
                linha.innerHTML = `
                    <td>${d.idDisciplina}</td>
                    <td>${d.nomeDisciplina}</td>
                    <td>
                        <input type="checkbox" class="check-disciplina" value="${d.idDisciplina}">
                    </td>
                `;
                tabelaBody.appendChild(linha);
            });
        })
        .catch(err => console.error("Erro ao listar disciplinas:", err));
}

// =============================
// Filtro da Tabela Disciplinas
// =============================
const filtroDisciplina = document.getElementById("filtroDisciplina");

filtroDisciplina.addEventListener("keyup", function () {
    const texto = filtroDisciplina.value.toLowerCase();
    const linhas = tabelaBody.getElementsByTagName("tr");

    for (let i = 0; i < linhas.length; i++) {
        const coluna = linhas[i].getElementsByTagName("td")[1];
        if (coluna) {
            const nome = coluna.textContent.toLowerCase();
            linhas[i].style.display = nome.includes(texto) ? "" : "none";
        }
    }
});

// =============================
// Filtro da Tabela Professores
// =============================
const filtroProfessor = document.getElementById("filtroProfessor");

filtroProfessor.addEventListener("keyup", function () {
    const texto = filtroProfessor.value.toLowerCase();
    const linhas = document.querySelector("#tableProfessor tbody").getElementsByTagName("tr");

    for (let i = 0; i < linhas.length; i++) {
        const colunaMatricula = linhas[i].getElementsByTagName("td")[2];
        if (colunaMatricula) {
            const matricula = colunaMatricula.textContent.toLowerCase();
            linhas[i].style.display = matricula.includes(texto) ? "" : "none";
        }
    }
});

// =============================
// Listar Professores
// =============================
function listarProfessores() {
    fetch("/professor/list")
        .then(res => res.json())
        .then(professores => {
            const tbody = document.querySelector("#tableProfessor tbody");
            tbody.innerHTML = "";

            professores.forEach(p => {
                const tipoTexto = p.tipoProfessor === 1 ? "Coordenador" : "Professor";

                const linha = document.createElement("tr");
                linha.innerHTML = `
                    <td>${p.idProfessor}</td>
                    <td>${p.nomeProfessor}</td>
                    <td>${p.matriProfessor}</td>                 
                    <td>${tipoTexto}</td>
                    <td>
                        <button class="btn-editar" data-id="${p.idProfessor}">Editar</button>
                        <button class="btn-excluir" data-id="${p.idProfessor}">Excluir</button>
                    </td>
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

    if (event.target.classList.contains("btn-editar")) {

        const idProfessor = event.target.getAttribute("data-id");

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
// Fechar modal
// =============================
document.querySelector("#btnCancelar").addEventListener("click", function () {
    document.querySelector("#modalEditar").style.display = "none";
});

// =============================
// Atualizar Professor
// =============================
document.querySelector("#formEditarProfessor").addEventListener("submit", function (event) {
    event.preventDefault();

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
        } else {
            alert("Erro ao atualizar professor.");
        }
    })
    .catch(err => console.error("Erro:", err));
});

//=====================================================================
// Event Listeners
//=====================================================================
formProfessor.addEventListener('submit', function(event) {
    event.preventDefault();
    salvarProfessor(); 
});

document.addEventListener("DOMContentLoaded", () => {
    listarDisciplinas();
    listarProfessores();
});

//=====================================================================
// Botão para voltar ao menu
//=====================================================================
document.getElementById("btnVoltar").onclick = () => {
    window.location.href = "/menu";
};



