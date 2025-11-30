package com.example.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.dto.QuestaoDTO;
import com.example.model.Questao;
import com.example.repository.QuestaoRepository;

import jakarta.transaction.Transactional;

@Service
public class QuestaoService {

    @Autowired
    private QuestaoRepository questaoRepository;

    // Lista todas as Questoes cadastradas
    public List<Questao> ListarTodos() {
        return questaoRepository.findAll();
    }

    // Busca a questao pelo ID
    public Questao GetByidQuestao(int idQuestao) {
        return questaoRepository.findByidQuestao(idQuestao);
    }

    // Salva uma questao no banco de dados
    @Transactional
    public Questao SalvarQuestao(QuestaoDTO dto) {

        // 🔥 1. Verificar duplicidade
        boolean existe = questaoRepository.existsByTextQuestaoAndIdDisciplina(
                dto.getTextQuestao().trim(),
                dto.getIdDisciplina()
        );

        if (existe) {
            // Lançar erro para o frontend exibir no relatório
            throw new RuntimeException(
                "Questão duplicada! Já existe esse enunciado cadastrado nessa disciplina."
            );
        }

        // 🔥 2. Criar entidade normalmente
        Questao quest = new Questao();
        quest.setIdDisciplina(dto.getIdDisciplina());
        quest.setIdProfessor(dto.getIdProfessor());
        quest.setTextQuestao(dto.getTextQuestao());
        quest.setAlterA(dto.getAlterA());
        quest.setAlterB(dto.getAlterB());
        quest.setAlterC(dto.getAlterC());
        quest.setAlterD(dto.getAlterD());
        quest.setAlterE(dto.getAlterE());
        quest.setResposta(dto.getResposta());

        return questaoRepository.save(quest);
    }

    // Exclui a questao do banco de dados pelo ID
    @Transactional
    public void ExcluirQuestao(int idQuestao) {
        questaoRepository.deleteById(idQuestao);
    }

    // Atualiza a questao pelo seu ID
    public Optional<Questao> AtualizarQuestao(int idQuestao, QuestaoDTO dto) {
        Optional<Questao> questaoOpt = questaoRepository.findById(idQuestao);
        if (questaoOpt.isPresent()) {

            // 🔥 Se quiser, também pode impedir atualização para texto duplicado
            boolean existe = questaoRepository.existsByTextQuestaoAndIdDisciplina(
                    dto.getTextQuestao().trim(),
                    dto.getIdDisciplina()
            );

            Questao atual = questaoOpt.get();
            if (existe && !atual.getTextQuestao().equals(dto.getTextQuestao().trim())) {
                throw new RuntimeException(
                    "Já existe outra questão com esse mesmo enunciado nesta disciplina."
                );
            }

            atual.setTextQuestao(dto.getTextQuestao());
            atual.setAlterA(dto.getAlterA());
            atual.setAlterB(dto.getAlterB());
            atual.setAlterC(dto.getAlterC());
            atual.setAlterD(dto.getAlterD());
            atual.setAlterE(dto.getAlterE());
            atual.setResposta(dto.getResposta());

            questaoRepository.save(atual);
            return Optional.of(atual);
        }
        return Optional.empty();
    }
}
