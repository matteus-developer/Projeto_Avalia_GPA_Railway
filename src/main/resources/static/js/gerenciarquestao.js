// Força HTTPS sempre, evitando Mixed Content
const API_BASE = `${window.location.origin.replace("http://", "https://")}/questao`; 

//=====================================================================
// Carrega o ID do professor logado
//=====================================================================
async function getProfessorLogado() {
    try {
        const resp = await fetch(`${API_BASE}/professor/sessao`);
        if (resp.ok) {
            const data = await resp.json();
            return data.idProfessor;
        }
    } catch (e) {
        console.error("Erro ao obter idProfessor da sessão:", e);
    }
    return null;
}

//=====================================================================
// Carrega disciplinas do professor logado
//=====================================================================
async function getDisciplinasProfessor() {
    try {
        const resp = await fetch(`${API_BASE}/carregarDisciplinas`);
        if (resp.ok) {
            const data = await resp.json();
            return data.map(d => d.idDisciplina);
        }
    } catch (e) {
        console.error("Erro ao obter disciplinas do professor:", e);
    }
    return [];
}

//=====================================================================
// Carrega todas as questões e renderiza a tabela
//=====================================================================
async function carregarTabela() {
    const tbody = document.querySelector("#tabelaQuestoes tbody");
    tbody.innerHTML = "";

    const idProfessorLogado = await getProfessorLogado();
    if (idProfessorLogado === null) return;

    const disciplinasDoProfessor = await getDisciplinasProfessor();
    const filtro = document.getElementById("filtroDisciplina").value.toLowerCase();

    try {
        const response = await fetch(`${API_BASE}/list`);
        const questoes = await response.json();

        questoes
            .filter(q => disciplinasDoProfessor.includes(q.disciplina?.idDisciplina))
            .filter(q => q.disciplina?.nomeDisciplina?.toLowerCase().includes(filtro))
            .forEach(q => {
                const tr = document.createElement("tr");

                const tdDisciplina = document.createElement("td");
                tdDisciplina.textContent = q.disciplina?.nomeDisciplina || "N/A";
                tdDisciplina.setAttribute("data-label", "Disciplina:");
                tr.appendChild(tdDisciplina);

                const tdProfessor = document.createElement("td");
                tdProfessor.textContent = q.nomeProfessor || "N/A";
                tdProfessor.setAttribute("data-label", "Professor:");
                tr.appendChild(tdProfessor);

                const tdTexto = document.createElement("td");
                tdTexto.textContent =
                    q.textQuestao.length > 50
                        ? q.textQuestao.substring(0, 50) + "..."
                        : q.textQuestao;
                tdTexto.setAttribute("data-label", "Texto da Questão:");
                tr.appendChild(tdTexto);

                const tdAcoes = document.createElement("td");
                tdAcoes.setAttribute("data-label", "Ações:");

                const btnView = document.createElement("button");
                btnView.textContent = "Exibir";
                btnView.classList.add("action-btn", "view");
                btnView.onclick = () => abrirModal(q, false);
                tdAcoes.appendChild(btnView);

                if (idProfessorLogado === q.idProfessor) {
                    const btnEdit = document.createElement("button");
                    btnEdit.textContent = "Editar";
                    btnEdit.classList.add("action-btn", "edit");
                    btnEdit.onclick = () => abrirModal(q, true);
                    tdAcoes.appendChild(btnEdit);

                    const btnDelete = document.createElement("button");
                    btnDelete.textContent = "Excluir";
                    btnDelete.classList.add("action-btn", "delete");
                    btnDelete.onclick = () => excluirQuestao(q.idQuestao);
                    tdAcoes.appendChild(btnDelete);
                }

                tr.appendChild(tdAcoes);
                tbody.appendChild(tr);
            });

    } catch (error) {
        console.error("Erro ao carregar questões:", error);
    }
}

//=====================================================================
// Modal
//=====================================================================
function abrirModal(questao, editar) {
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modalTitle");
    const modalBody = document.getElementById("modalBody");

    modalTitle.textContent = editar ? "Editar Questão" : "Visualizar Questão";

    if (editar) {
        modalBody.innerHTML = `
            <label>Disciplina:</label>
            <input type="text" value="${questao.disciplina?.nomeDisciplina || ''}" readonly>

            <label>Texto:</label>
            <textarea id="texto">${questao.textQuestao}</textarea>
            <label>Alternativa A:</label>
            <input type="text" id="alterA" value="${questao.alterA}">
            <label>Alternativa B:</label>
            <input type="text" id="alterB" value="${questao.alterB}">
            <label>Alternativa C:</label>
            <input type="text" id="alterC" value="${questao.alterC}">
            <label>Alternativa D:</label>
            <input type="text" id="alterD" value="${questao.alterD}">
            <label>Alternativa E:</label>
            <input type="text" id="alterE" value="${questao.alterE}">
            <label>Resposta (A, B, C, D ou E):</label>
            <input type="text" id="resposta" value="${questao.resposta}">
            <button id="salvarBtn">Salvar</button>
            <p id="msgSucesso" style="color:green; display:none;">✅ Questão atualizada com sucesso!</p>
        `;
        document.getElementById("salvarBtn").onclick = () =>
            salvarQuestao(questao.idQuestao, questao.disciplina.idDisciplina);
    } else {
        modalBody.innerHTML = `
            <form>
                <label>Disciplina:</label>
                <input type="text" value="${questao.disciplina?.nomeDisciplina || ''}" readonly>
                <label>Enunciado:</label>
                <textarea readonly>${questao.textQuestao}</textarea>
                <label>Alternativa A:</label>
                <input type="text" value="${questao.alterA}" readonly>
                <label>Alternativa B:</label>
                <input type="text" value="${questao.alterB}" readonly>
                <label>Alternativa C:</label>
                <input type="text" value="${questao.alterC}" readonly>
                <label>Alternativa D:</label>
                <input type="text" value="${questao.alterD}" readonly>
                <label>Alternativa E:</label>
                <input type="text" value="${questao.alterE}" readonly>
                <label>Resposta Correta:</label>
                <input type="text" value="${questao.resposta}" readonly>
            </form>
        `;
    }

    modal.style.display = "block";
}

document.querySelector(".close").onclick = () => {
    document.getElementById("modal").style.display = "none";
};
window.onclick = (event) => {
    const modal = document.getElementById("modal");
    if (event.target === modal) modal.style.display = "none";
};

//=====================================================================
// Salvar
//=====================================================================
async function salvarQuestao(idQuestao, idDisciplina) {
    const dto = {
        textQuestao: document.getElementById("texto").value,
        alterA: document.getElementById("alterA").value,
        alterB: document.getElementById("alterB").value,
        alterC: document.getElementById("alterC").value,
        alterD: document.getElementById("alterD").value,
        alterE: document.getElementById("alterE").value,
        resposta: document.getElementById("resposta").value.toUpperCase(),
        idDisciplina: idDisciplina
    };

    try {
        const response = await fetch(`${API_BASE}/atualizar/${idQuestao}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dto)
        });

        if (response.ok) {
            document.getElementById("msgSucesso").style.display = "block";
            setTimeout(() => {
                document.getElementById("modal").style.display = "none";
                carregarTabela();
            }, 1500);
        }
    } catch (error) {
        console.error("Erro ao atualizar questão:", error);
    }
}

//=====================================================================
// Excluir
//=====================================================================
async function excluirQuestao(idQuestao) {
    if (!confirm("Deseja realmente excluir esta questão?")) return;
    try {
        const resp = await fetch(`${API_BASE}/excluir/${idQuestao}`, { method: "DELETE" });
        if (resp.ok) carregarTabela();
    } catch (error) {
        console.error("Erro ao excluir questão:", error);
    }
}

//=====================================================================
// Botão Voltar
//=====================================================================
document.getElementById("btnVoltar").onclick = () => {
    window.location.href = "/menu";
};

//=====================================================================
// Filtro
//=====================================================================
document.getElementById("filtroDisciplina").addEventListener("input", () => carregarTabela());

//=====================================================================
// Inicializa
//=====================================================================
carregarTabela();
