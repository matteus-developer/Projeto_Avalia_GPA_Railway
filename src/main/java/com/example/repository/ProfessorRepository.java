package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.model.Professor;

public interface ProfessorRepository extends JpaRepository<Professor, Integer>{
	
	//Busca o professor pela matricula
	public Professor findBymatriProfessor(String matriProfessor);
	
	//Busca o professor pelo email
	public Professor findByemailProfessor(String emailProfessor);
	
	//Busca o professor pelo seu idProfessor
	public Professor findByIdProfessor(int idProfessor);

}
