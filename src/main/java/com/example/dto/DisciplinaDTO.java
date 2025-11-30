package com.example.dto;

import jakarta.validation.constraints.NotBlank;

public class DisciplinaDTO {
	@NotBlank(message = "Preencha o campo!")
	private String nomeDisciplina;

	public String getNomeDisciplina() {
		return nomeDisciplina;
	}

	public void setNomeDisciplina(String nomeDisciplina) {
		this.nomeDisciplina = nomeDisciplina;
	}
	
}
