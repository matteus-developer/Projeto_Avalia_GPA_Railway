package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.model.Professor;

public interface ProfessorRepository extends JpaRepository<Professor, Integer>{

	public Professor findBymatriProfessor(String matriProfessor);
	

	public Professor findByemailProfessor(String emailProfessor);
	

	public Professor findByIdProfessor(int idProfessor);

	public boolean existsByMatriProfessor(String matriProfessor);

}
