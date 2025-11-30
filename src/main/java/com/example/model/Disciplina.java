package com.example.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Disciplina {
	
	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idDisciplina") //informa o nome real da coluna
	private int idDisciplina;
	private String nomeDisciplina;
	
	public Disciplina() {
		super();
	}

	public Disciplina(int idDisciplina, String nomeDisciplina) {
		super();
		this.idDisciplina = idDisciplina;
		this.nomeDisciplina = nomeDisciplina;
	}

	
	public int getIdDisciplina() {
		return idDisciplina;
	}
	
	public String getNomeDisciplina() {
		return nomeDisciplina;
	}

	public void setNomeDisciplina(String nomeDisciplina) {
		this.nomeDisciplina = nomeDisciplina;
	}

	
}
