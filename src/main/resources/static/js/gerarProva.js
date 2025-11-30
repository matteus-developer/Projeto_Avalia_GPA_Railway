document.addEventListener("DOMContentLoaded", () => {

    const tbody = document.querySelector("#tabelaQuestoes tbody");
    const filtroInput = document.getElementById("filtroDisciplina");
    const btnPreview = document.getElementById("btnPreview");
    const btnGerarPdf = document.getElementById("btnGerarPdf");
    const btnVoltar = document.getElementById("btnVoltar");

    let disciplinasPermitidas = [];
    let questoes = [];

    // ============================================
    // Função para carregar disciplinas do professor
    // ============================================
    async function carregarDisciplinas() {
        try {
            const response = await fetch("/questao/carregarDisciplinas");
            disciplinasPermitidas = await response.json();
            disciplinasPermitidas = disciplinasPermitidas.map(d => d.nomeDisciplina.toLowerCase());
        } catch (error) {
            console.error("Erro ao carregar disciplinas:", error);
        }
    }

    // ============================================
    // Função para carregar todas as questões
    // ============================================
    async function carregarQuestoes() {
        try {
            const response = await fetch("/questao/list");
            questoes = await response.json();
            renderTabela();
        } catch (error) {
            console.error("Erro ao carregar questões:", error);
        }
    }

    // ============================================
    // Função para renderizar a tabela
    // ============================================
    function renderTabela(filtro = "") {
        tbody.innerHTML = "";
        const filtroLower = filtro.toLowerCase();

        const filtradas = questoes.filter(q => {
            const disc = q.disciplina?.nomeDisciplina?.toLowerCase() || "";
            return disciplinasPermitidas.includes(disc) && disc.includes(filtroLower);
        });

        if (filtradas.length === 0) {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td colspan="4" style="text-align:center;">Nenhuma questão encontrada.</td>`;
            tbody.appendChild(tr);
            return;
        }

        filtradas.forEach(q => {
            const tr = document.createElement("tr");
			const textoCortado = q.textQuestao.length > 50 
			    ? q.textQuestao.substring(0, 50) + "..." 
			    : q.textQuestao;

			tr.innerHTML = `
			    <td><input type="checkbox" class="selectQuestao" value="${q.idQuestao}"></td>
			    <td title="${q.textQuestao}">${textoCortado}</td> <!-- title mostra o texto completo ao passar o mouse -->
			    <td>${q.disciplina?.nomeDisciplina || ""}</td>
			    <td><button onclick="visualizarQuestao(${q.idQuestao})">Ver</button></td>
			`;
            tbody.appendChild(tr);
        });
    }

    // ============================================
    // Evento do filtro
    // ============================================
    filtroInput.addEventListener("input", e => renderTabela(e.target.value));

    // ============================================
    // Inicialização
    // ============================================
    (async () => {
        await carregarDisciplinas();
        await carregarQuestoes();
    })();

    // ============================================
    // Botão Pré-visualizar
    // ============================================
    btnPreview.addEventListener("click", () => {
        const cabecalho = document.getElementById("cabecalho").value;

        const selecionadas = [...document.querySelectorAll(".selectQuestao:checked")]
            .map(c => Number(c.value));

        if (selecionadas.length === 0) {
            alert("Selecione pelo menos uma questão.");
            return;
        }

        const escolhidas = selecionadas.map(id => questoes.find(q => q.idQuestao === id));

        let html = `<h3>Cabeçalho</h3><p>${cabecalho}</p><hr><h3>Questões</h3>`;

        escolhidas.forEach((q, i) => {
            html += `
                <p><b>${i + 1}) ${q.textQuestao}</b></p>
                <ul>
                    <li>A) ${q.alterA}</li>
                    <li>B) ${q.alterB}</li>
                    <li>C) ${q.alterC}</li>
                    <li>D) ${q.alterD}</li>
                    <li>E) ${q.alterE}</li>
                </ul><hr>
            `;
        });

        document.getElementById("conteudoPreview").innerHTML = html;
        document.getElementById("modalPreview").style.display = "block";
    });

    // ============================================
    // Botão Gerar PDF
    // ============================================
    btnGerarPdf.addEventListener("click", () => {
        const cabecalho = document.getElementById("cabecalho").value;

        const selecionadas = [...document.querySelectorAll(".selectQuestao:checked")]
            .map(c => c.value);

        if (selecionadas.length === 0) {
            alert("Selecione pelo menos uma questão.");
            return;
        }

        const form = document.createElement("form");
        form.method = "POST";
        form.action = "/prova/gerar";

        const cab = document.createElement("input");
        cab.type = "hidden";
        cab.name = "cabecalho";
        cab.value = cabecalho;
        form.appendChild(cab);

        selecionadas.forEach(id => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = "questoesSelecionadas";
            input.value = id;
            form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
    });

    // ============================================
    // Botão Voltar
    // ============================================
    btnVoltar.addEventListener("click", () => {
        window.location.href = "/menu";
    });

});

// ============================================
// Função para visualizar questão no modal
// ============================================
async function visualizarQuestao(id) {
    try {
        const response = await fetch(`/questao/${id}`);
        if (!response.ok) throw new Error("Questão não encontrada");
        const q = await response.json();

        document.getElementById("conteudoModal").innerHTML = `
            <h4>${q.textQuestao}</h4>
            <ul>
                <li>A) ${q.alterA}</li>
                <li>B) ${q.alterB}</li>
                <li>C) ${q.alterC}</li>
                <li>D) ${q.alterD}</li>
                <li>E) ${q.alterE}</li>
            </ul>
        `;
        document.getElementById("modalVisualizar").style.display = "block";
    } catch (error) {
        console.error("Erro ao buscar questão:", error);
        alert("Não foi possível carregar a questão.");
    }
}

function fecharModal() {
    document.getElementById("modalVisualizar").style.display = "none";
}

function fecharPreview() {
    document.getElementById("modalPreview").style.display = "none";
}



