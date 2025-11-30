// Carrega disciplinas ao abrir a página
document.addEventListener("DOMContentLoaded", () => {
    carregarDisciplinas();
    inicializarDragAndDrop();
});

// ==================================================
// Buscar disciplinas autorizadas para o professor
// ==================================================
function carregarDisciplinas() {
    fetch("/questao/carregarDisciplinas")
        .then(resp => resp.json())
        .then(disciplinas => {
            let select = document.getElementById("selectDisciplina");
            select.innerHTML = "";

            disciplinas.forEach(d => {
                let option = document.createElement("option");
                option.value = d.idDisciplina;
                option.textContent = d.nomeDisciplina;
                select.appendChild(option);
            });
        })
        .catch(err => console.error("Erro ao carregar disciplinas:", err));
}

// ==================================================
// DRAG AND DROP - Inicialização
// ==================================================
function inicializarDragAndDrop() {
    const dropArea = document.getElementById('dropArea');
    const fileInput = document.getElementById('fileInput');

    // Previne comportamento padrão para todos os eventos de drag
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });

    // Adiciona classe quando arquivo está sobre a área
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => {
            dropArea.classList.add('drag-over');
        }, false);
    });

    // Remove classe quando arquivo sai da área
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => {
            dropArea.classList.remove('drag-over');
        }, false);
    });

    // Manipula o drop do arquivo
    dropArea.addEventListener('drop', handleDrop, false);

    // Clique na área abre seletor de arquivo
    dropArea.addEventListener('click', () => {
        fileInput.click();
    });

    // Quando seleciona arquivo pelo input
    fileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;

    if (files.length > 0) {
        handleFile(files[0]);
    }

    //Reset para permitir arrastar o mesmo arquivo duas vezes
    document.getElementById("fileInput").value = "";
}


// ==================================================
// PROCESSAR ARQUIVO
// ==================================================
function handleFile(file) {
    if (!file.name.endsWith('.txt')) {
        mostrarResultado('Apenas arquivos .txt são aceitos!', 'erro');
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        const conteudo = e.target.result;
        processarConteudo(conteudo);

        // 🔥 RESET crítico para permitir enviar o mesmo arquivo novamente
        document.getElementById("fileInput").value = "";
    };

    reader.onerror = function() {
        mostrarResultado('Erro ao ler o arquivo!', 'erro');

        // 🔥 Também resetar em caso de erro
        document.getElementById("fileInput").value = "";
    };

    reader.readAsText(file);
}


// ==================================================
// PROCESSAR CONTEÚDO DO ARQUIVO - MODO INTELIGENTE
// ==================================================
function processarConteudo(conteudo) {

    const linhas = conteudo.split("\n")
        .map(l => l.trim())
        .filter(l => l !== "");

    const questoes = [];
    let disciplinaAtual = null;

    let i = 0;

    while (i < linhas.length) {

        const linha = linhas[i];

        // ---------------------------------------------
        // 1️⃣ Detectar disciplina
        // ---------------------------------------------
        if (linha.toLowerCase().startsWith("disciplina:")) {
            disciplinaAtual = linha.substring("Disciplina:".length).trim();

            if (!disciplinaAtual) {
                mostrarResultado("Erro: Nome da disciplina não foi informado.", "erro");
                return;
            }

            i++;
            continue;
        }

        // ---------------------------------------------
        // Sem disciplina definida → erro
        // ---------------------------------------------
        if (disciplinaAtual == null) {
            mostrarResultado(
                "Erro: O arquivo deve começar com\nDisciplina: Nome da Disciplina",
                "erro"
            );
            return;
        }

        // ---------------------------------------------
        // 2️⃣ Ler uma questão (precisa de 7 linhas)
        // ---------------------------------------------
        if (i + 6 >= linhas.length) {
            mostrarResultado(
                `Erro: Questão incompleta após o enunciado:\n${linha}`,
                "erro"
            );
            return;
        }

        const questao = {
            nomeDisciplina: disciplinaAtual,
            textQuestao: linhas[i],
            alterA: linhas[i + 1],
            alterB: linhas[i + 2],
            alterC: linhas[i + 3],
            alterD: linhas[i + 4],
            alterE: linhas[i + 5],
            resposta: linhas[i + 6].toUpperCase()
        };

        // validação da resposta
        if (!["A", "B", "C", "D", "E"].includes(questao.resposta)) {
            mostrarResultado(
                `Erro: Resposta inválida "${questao.resposta}" na questão:\n${questao.textQuestao}`,
                "erro"
            );
            return;
        }

        questoes.push(questao);

        i += 7;
    }

    enviarQuestoesEmLote(questoes);
}


// ==================================================
// AGRUPAR ERROS REPETIDOS
// ==================================================
function agruparErros(errosDetalhes) {
    const grupos = [];
    let erroAtual = null;
    let inicio = 0;
    let fim = 0;
    let contador = 0;

    errosDetalhes.forEach((linha, index) => {
        const mensagem = linha.replace(/^Questão \d+ \([^)]*\): /, "");

        if (erroAtual === null) {
            erroAtual = mensagem;
            inicio = index + 1;
            fim = index + 1;
            contador = 1;
        } else if (mensagem === erroAtual) {
            fim = index + 1;
            contador++;
        } else {
            if (contador >= 4) {
                grupos.push(`Questões ${inicio}–${fim}: ${erroAtual}`);
            } else {
                for (let q = inicio; q <= fim; q++) {
                    grupos.push(`Questão ${q}: ${erroAtual}`);
                }
            }

            erroAtual = mensagem;
            inicio = index + 1;
            fim = index + 1;
            contador = 1;
        }
    });

    if (erroAtual !== null) {
        if (contador >= 4) {
            grupos.push(`Questões ${inicio}–${fim}: ${erroAtual}`);
        } else {
            for (let q = inicio; q <= fim; q++) {
                grupos.push(`Questão ${q}: ${erroAtual}`);
            }
        }
    }

    return grupos;
}
// ==================================================
// ENVIAR QUESTÕES EM LOTE (ALTERADO)
// ==================================================
async function enviarQuestoesEmLote(questoes) {
    const progressContainer = document.getElementById('progressContainer');
    const progressFill = document.getElementById('progressFill');
    const resultadoDiv = document.getElementById('resultadoImportacao');

    progressContainer.style.display = 'block';
    resultadoDiv.style.display = 'none';

    let sucessos = 0;
    let erros = 0;
    const errosDetalhes = [];

    const questoesPorDisciplina = {};
    questoes.forEach(q => {
        if (!questoesPorDisciplina[q.nomeDisciplina]) {
            questoesPorDisciplina[q.nomeDisciplina] = 0;
        }
        questoesPorDisciplina[q.nomeDisciplina]++;
    });

    for (let i = 0; i < questoes.length; i++) {
        const questao = questoes[i];
        const progresso = Math.round(((i + 1) / questoes.length) * 100);

        progressFill.style.width = progresso + '%';
        progressFill.textContent = `${progresso}% (${i + 1}/${questoes.length})`;

        try {
            await salvarQuestaoImportada(questao);
            sucessos++;
        } catch (error) {
            erros++;
            errosDetalhes.push(`Questão ${i + 1} (${questao.nomeDisciplina}): ${error.message}`);
        }

        await new Promise(resolve => setTimeout(resolve, 100));
    }

    setTimeout(() => {
        progressContainer.style.display = 'none';
        
        let mensagem = `✅ ${sucessos} questão(ões) importada(s) com sucesso!\n\n`;

        mensagem += '📊 Resumo por disciplina:\n';
        for (const [disciplina, total] of Object.entries(questoesPorDisciplina)) {
            mensagem += `   • ${disciplina}: ${total} questão(ões)\n`;
        }

        if (erros > 0) {
            const errosAgrupados = agruparErros(errosDetalhes);
            mensagem += `\n❌ ${erros} questão(ões) com erro:\n${errosAgrupados.join('\n')}`;
        }

        mostrarResultado(mensagem, erros > 0 ? 'erro' : 'sucesso');
    }, 500);
}

// ==================================================
// SALVAR QUESTÃO
// ==================================================
async function salvarQuestaoImportada(questao) {
    const disciplinas = await fetch("/questao/carregarDisciplinas")
        .then(resp => resp.json());

    const disciplina = disciplinas.find(d =>
        d.nomeDisciplina.toLowerCase().trim() === questao.nomeDisciplina.toLowerCase().trim()
    );

    if (!disciplina) {
        throw new Error(`Disciplina "${questao.nomeDisciplina}" não encontrada ou você não tem permissão`);
    }

    const dto = {
        textQuestao: questao.textQuestao,
        alterA: questao.alterA,
        alterB: questao.alterB,
        alterC: questao.alterC,
        alterD: questao.alterD,
        alterE: questao.alterE,
        resposta: questao.resposta,
        idDisciplina: disciplina.idDisciplina
    };

    const response = await fetch("/questao/salvar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao salvar: ${errorText || response.statusText}`);
    }

    return await response.json();
}

// ==================================================
// MOSTRAR RESULTADO
// ==================================================
function mostrarResultado(mensagem, tipo) {
    const resultadoDiv = document.getElementById('resultadoImportacao');
    
    resultadoDiv.style.display = 'block';
    resultadoDiv.className = 'resultado-importacao';
    
    if (tipo === 'sucesso') {
        resultadoDiv.classList.add('resultado-sucesso');
    } else {
        resultadoDiv.classList.add('resultado-erro');
    }
    
    resultadoDiv.innerHTML = `<pre style="white-space: pre-wrap; font-size: 14px;">${mensagem}</pre>`;

    if (tipo === 'sucesso') {
        setTimeout(() => {
            resultadoDiv.style.display = 'none';
        }, 8000);
    }
}

// ==================================================
// FORMULÁRIO INDIVIDUAL
// ==================================================
document.getElementById("formQuestao").addEventListener("submit", function (e) {
    e.preventDefault();

    const questao = {
        textQuestao: document.getElementById("textQuestao").value,
        alterA: document.getElementById("alterA").value,
        alterB: document.getElementById("alterB").value,
        alterC: document.getElementById("alterC").value,
        alterD: document.getElementById("alterD").value,
        alterE: document.getElementById("alterE").value,
        resposta: document.getElementById("resposta").value.toUpperCase(),
        idDisciplina: document.getElementById("selectDisciplina").value
    };

    fetch("/questao/salvar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questao)
    })
        .then(resp => {
            if (!resp.ok) throw new Error("Erro ao salvar questão");
            return resp.json();
        })
        .then(() => {
            alert("Questão cadastrada com sucesso!");
            document.getElementById("formQuestao").reset();
        })
        .catch(err => console.error("Erro ao salvar questão:", err));
});

// ==================================================
// Botão Voltar
// ==================================================
document.getElementById("btnVoltar").addEventListener("click", () => {
    window.location.href = "/menu";
});
