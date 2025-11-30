package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.model.Disciplina;

public interface DisciplinaRepository extends JpaRepository<Disciplina, Integer> {
	
	//Verifica a existencia de uma disciplina pelo nome
	public boolean existsBynomeDisciplina(String nomeDisciplina);
	
}
