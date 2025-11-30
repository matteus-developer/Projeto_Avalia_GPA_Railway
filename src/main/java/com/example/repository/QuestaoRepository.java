package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.model.Questao;

public interface QuestaoRepository extends JpaRepository<Questao, Integer>{
	
	//Procura a questao pelo seu Id
	public Questao findByidQuestao (int idQuestao);
	
	//Procura a questao pelo id da disciplina
	public Questao findByidDisciplina (int idDisciplina);
	
	boolean existsByTextQuestaoAndIdDisciplina(String textQuestao, int idDisciplina);
	
	
}
