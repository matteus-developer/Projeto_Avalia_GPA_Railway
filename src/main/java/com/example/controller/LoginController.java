package com.example.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.model.Disciplina;
import com.example.model.Professor;
import com.example.service.LoginService;

import org.springframework.ui.Model;
import jakarta.servlet.http.HttpSession;

@Controller
public class LoginController {
	
	 @Autowired
	    private LoginService loginService;

	 	//Verifica as credenciais do professor no banco de dados e ao realizar o login salva o idProfessor e idsDisciplinas na sessão
	 @PostMapping("/login")
	 public String login(@RequestParam String matriProfessor,
	                     @RequestParam String senhaProfessor,
	                     HttpSession session,
	                     Model model) {

	     Professor professor = loginService.autenticar(matriProfessor, senhaProfessor);

	     if (professor == null) {
	         model.addAttribute("erro", "Matricula ou senha inválidos!");
	         return "htmlLogin/login";
	     }

	     // Salva ID do professor na sessão
	     session.setAttribute("idProfessor", professor.getIdProfessor());

	     // Salva lista de IDs das disciplinas do professor
	     List<Integer> idsDisciplinas = professor.getDisciplinas()
	         .stream()
	         .map(Disciplina::getIdDisciplina)
	         .collect(Collectors.toList());
	     session.setAttribute("idsDisciplinas", idsDisciplinas);

	     // Salva tipo do professor na sessão (0 = Professor, 1 = Coordenador)
	     session.setAttribute("tipoProfessor", professor.getTipoProfessor());

	     return "redirect:/menu";
	 }
}
