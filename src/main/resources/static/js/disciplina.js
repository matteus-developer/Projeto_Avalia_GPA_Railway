const disciplina = document.querySelector("form");
const idDisciplina = document.querySelector(".disciplina");

// ============================
// Função Salvar disciplina
// ============================
function salvar() {
    if (idDisciplina.value === "") {
        alert("Campo vazio!");
        return;
    }

    const nomeDisciplina = idDisciplina.value;

    // 1. Verificar se já existe (URL relativa → CORREÇÃO DO MIXED CONTENT)
    fetch(`/disciplina/procura/${nomeDisciplina}`)
        .then(res => {
            if (!res.ok) {
                console.error("Erro na requisição de procura:", res.statusText);
                throw new Error("Erro de servidor ao verificar disciplina.");
            }
            return res.json();
        })
        .then(existe => {

            if (existe) {
                alert(`A disciplina "${nomeDisciplina}" já está cadastrada!`);
                return;
            }

            // 2. Salvar disciplina
            return fetch("/disciplina/salvar", {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({
                    nomeDisciplina: nomeDisciplina
                })
            });
        })
        .then(res => {
            if (res && res.ok) {
                limpar();
                listarDisciplinas();
                alert(`Disciplina "${nomeDisciplina}" salva com sucesso!`);
            } else if (res) {
                console.error("Erro ao salvar disciplina:", res.statusText);
                alert(`Erro ao salvar a disciplina "${nomeDisciplina}".`);
            }
        })
        .catch(err => {
            console.error("Erro na operação:", err);
            alert("Ocorreu um erro na requisição: " + err.message);
        });
}

// ============================
// FILTRO DE DISCIPLINAS
// ============================
const campoBusca = document.getElementById("campoBusca");

campoBusca.addEventListener("input", function () {
    const filtro = campoBusca.value.toLowerCase();
    const linhas = document.querySelectorAll("#tableDisciplina tbody tr");

    linhas.forEach(linha => {
        const nomeDisciplina = linha.children[1].textContent.toLowerCase();
        linha.style.display = nomeDisciplina.includes(filtro) ? "" : "none";
    });
});

// ============================
// Limpa o input
// ============================
function limpar() {
    idDisciplina.value = "";
}

// ============================
// Excluir disciplina
// ============================
function excluirDisciplina(id) {
    if (!confirm(`Tem certeza que deseja excluir a disciplina com ID ${id}?`)) {
        return;
    }

    fetch(`/disciplina/excluir/${id}`, {  // URL relativa → CORREÇÃO DO MIXED
        method: "DELETE"
    })
        .then(res => {
            if (res.ok) {
                console.log(`Disciplina ${id} excluída.`);
                listarDisciplinas();
            } else {
                console.error(`Erro ao excluir disciplina ${id}:`, res.statusText);
            }
        })
        .catch(err => {
            console.error("Erro na requisição DELETE:", err);
        });
}

const tabelaBody = document.querySelector("#tableDisciplina tbody");

// ============================
// Listar disciplinas
// ============================
function listarDisciplinas() {
    fetch("/disciplina/list")  // URL relativa → CORREÇÃO DO MIXED
        .then(res => res.json())
        .then(disciplinas => {

            const tbody = document.querySelector("#tableDisciplina tbody");

            if (!tbody) {
                console.error("Elemento <tbody> não encontrado.");
                return;
            }

            tbody.innerHTML = "";

            disciplinas.forEach(d => {
                const linha = document.createElement("tr");

                linha.innerHTML = `
                    <td>${d.idDisciplina}</td>
                    <td>${d.nomeDisciplina}</td>
                    <td>
                        <button class="btn-excluir" data-id="${d.idDisciplina}">
                            Excluir
                        </button>
                    </td>
                `;

                tbody.appendChild(linha);
            });

            document.querySelectorAll(".btn-excluir").forEach(button => {
                button.addEventListener("click", function () {
                    excluirDisciplina(this.getAttribute("data-id"));
                });
            });

        })
        .catch(err => {
            console.error("Erro ao listar disciplinas:", err);
        });
}

// Formulário
disciplina.addEventListener("submit", function (event) {
    event.preventDefault();
    salvar();
});

// Ao carregar página
document.addEventListener("DOMContentLoaded", listarDisciplinas);

// Botão voltar
document.getElementById("btnVoltar").onclick = () => {
    window.location.href = "/menu";
};
