package com.example.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.example.model.Professor;
import com.example.service.ProfessorService;

import org.springframework.ui.Model;
import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/menu")
public class MenuController {

    @Autowired
    private ProfessorService professorService;

    @GetMapping
    public String carregarMenu(HttpSession session, Model model) {

        // Recupera ID do professor salvo na sessão
        Integer idProfessor = (Integer) session.getAttribute("idProfessor");

        if (idProfessor == null) {
            return "redirect:/login"; // não logado
        }

        // Busca o professor novamente no banco
        Professor professor = professorService.GetByidProfessor(idProfessor);

        if (professor == null) {
            return "redirect:/login";
        }

        // Envia dados para a tela
        model.addAttribute("nomeProfessor", professor.getNomeProfessor());
        model.addAttribute("disciplinas", professor.getDisciplinas());

        return "htmlMenu/menu"; // carrega menu.html
    }
}