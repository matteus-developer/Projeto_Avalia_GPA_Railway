package com.example.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class QuestaoDTO {
	
	@NotNull(message = "A disciplina é obrigatória")
	private int idDisciplina;
	@NotNull(message = "O id do professor é obrigatório")
	private int idProfessor;
	@NotBlank(message = "Preencha o campo!")
	private String textQuestao;
	@NotBlank(message = "Preencha o campo!")
	private String alterA;
	@NotBlank(message = "Preencha o campo!")
	private String alterB;
	@NotBlank(message = "Preencha o campo!")
	private String alterC;
	@NotBlank(message = "Preencha o campo!")
	private String alterD;
	@NotBlank(message = "Preencha o campo!")
	private String alterE;
	@NotBlank(message = "Preencha o campo!")
	private String resposta;
	
	public int getIdDisciplina() {
		return idDisciplina;
	}
	public void setIdDisciplina(int idDisciplina) {
		this.idDisciplina = idDisciplina;
	}
	public int getIdProfessor() {
		return idProfessor;
	}
	public void setIdProfessor(int idProfessor) {
		this.idProfessor = idProfessor;
	}
	public String getTextQuestao() {
		return textQuestao;
	}
	public void setTextQuestao(String textQuestao) {
		this.textQuestao = textQuestao;
	}
	public String getAlterA() {
		return alterA;
	}
	public void setAlterA(String alterA) {
		this.alterA = alterA;
	}
	public String getAlterB() {
		return alterB;
	}
	public void setAlterB(String alterB) {
		this.alterB = alterB;
	}
	public String getAlterC() {
		return alterC;
	}
	public void setAlterC(String alterC) {
		this.alterC = alterC;
	}
	public String getAlterD() {
		return alterD;
	}
	public void setAlterD(String alterD) {
		this.alterD = alterD;
	}
	public String getAlterE() {
		return alterE;
	}
	public void setAlterE(String alterE) {
		this.alterE = alterE;
	}
	public String getResposta() {
		return resposta;
	}
	public void setResposta(String resposta) {
		this.resposta = resposta;
	}
	
	
	
}
