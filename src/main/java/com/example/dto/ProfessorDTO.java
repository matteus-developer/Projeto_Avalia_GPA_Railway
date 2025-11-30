package com.example.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class ProfessorDTO {

    @NotBlank(message = "Preencha o campo!")
    private String nomeProfessor;

    @NotBlank(message = "Preencha o campo!")
    private String matriProfessor;

    @NotBlank(message = "Preencha o campo!")
    private String emailProfessor;

    @NotBlank(message = "Preencha o campo!")
    private String senhaProfessor;
    
    private byte tipoProfessor;

    //IDs das disciplinas selecionadas no frontend
    private List<Integer> idsDisciplinas;

    public String getNomeProfessor() {
        return nomeProfessor;
    }

    public void setNomeProfessor(String nomeProfessor) {
        this.nomeProfessor = nomeProfessor;
    }

    public String getMatriProfessor() {
        return matriProfessor;
    }

    public void setMatriProfessor(String matriProfessor) {
        this.matriProfessor = matriProfessor;
    }

    public String getEmailProfessor() {
        return emailProfessor;
    }

    public void setEmailProfessor(String emailProfessor) {
        this.emailProfessor = emailProfessor;
    }

    public String getSenhaProfessor() {
        return senhaProfessor;
    }

    public void setSenhaProfessor(String senhaProfessor) {
        this.senhaProfessor = senhaProfessor;
    }

    public List<Integer> getIdsDisciplinas() {
        return idsDisciplinas;
    }

    public void setIdsDisciplinas(List<Integer> idsDisciplinas) {
        this.idsDisciplinas = idsDisciplinas;
    }

	public byte getTipoProfessor() {
		return tipoProfessor;
	}

	public void setTipoProfessor(byte tipoProfessor) {
		this.tipoProfessor = tipoProfessor;
	}
    
    
}
