package com.example.dto;

import com.example.model.Disciplina;

public class QuestaoResponseDTO {

	private Integer idProfessor;
    private int idQuestao;
    private String textQuestao;
    private String alterA;
    private String alterB;
    private String alterC;
    private String alterD;
    private String alterE;
    private String resposta;
    private Disciplina disciplina; // objeto Disciplina
    private String nomeProfessor;   // nome do professor

    
    
    
    public Integer getIdProfessor() {
		return idProfessor;
	}

	public void setIdProfessor(Integer idProfessor) {
		this.idProfessor = idProfessor;
	}

	public int getIdQuestao() {
        return idQuestao;
    }

    public void setIdQuestao(int idQuestao) {
        this.idQuestao = idQuestao;
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

    public Disciplina getDisciplina() {
        return disciplina;
    }

    public void setDisciplina(Disciplina disciplina) {
        this.disciplina = disciplina;
    }

    public String getNomeProfessor() {
        return nomeProfessor;
    }

    public void setNomeProfessor(String nomeProfessor) {
        this.nomeProfessor = nomeProfessor;
    }
}
