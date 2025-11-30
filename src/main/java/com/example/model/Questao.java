package com.example.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Questao {

	@Id @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idQuestao") //informa o nome real da coluna
	private int idQuestao;
	
	@ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idDisciplina", insertable = false, updatable = false)
    private Disciplina disciplina;
	
	private int idDisciplina;
	private int idProfessor;
	@Column(length = 2000) // <-- define o tamanho para 2000
	private String textQuestao;
	 @Column(length = 2000) // <-- define o tamanho para 2000
	private String alterA;
	 @Column(length = 2000) // <-- define o tamanho para 2000
	private String alterB;
	 @Column(length = 2000) // <-- define o tamanho para 2000
	private String alterC;
	 @Column(length = 2000) // <-- define o tamanho para 2000
	private String alterD;
	 @Column(length = 2000) // <-- define o tamanho para 2000
	private String alterE;
	private String resposta;
	
	public Questao() {
		super();
	}

	public Questao(int idQuestao, int idDisciplina, int idProfessor, String textQuestao, String alterA, String alterB,
			String alterC, String alterD, String alterE, String resposta) {
		super();
		this.idQuestao = idQuestao;
		this.idDisciplina = idDisciplina;
		this.idProfessor = idProfessor;
		this.textQuestao = textQuestao;
		this.alterA = alterA;
		this.alterB = alterB;
		this.alterC = alterC;
		this.alterD = alterD;
		this.alterE = alterE;
		this.resposta = resposta;
	}
	
	public Disciplina getDisciplina() {
        return disciplina;
    }
    public void setDisciplina(Disciplina disciplina) {
        this.disciplina = disciplina;
    }

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

	public int getIdQuestao() {
		return idQuestao;
	}
	
}
