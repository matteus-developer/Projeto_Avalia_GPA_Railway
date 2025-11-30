package com.example.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.model.Professor;
import com.example.service.ProfessorService;

@Controller
public class RecuperacaoSenhaController {

    @Autowired
    private ProfessorService professorService;

    @PostMapping("/recuperar-senha")
    public String validar(
            @RequestParam String email,
            @RequestParam String matricula,
            Model model) {

        Professor professor = professorService.buscarPorEmailEMatricula(email, matricula);

        if (professor == null) {
            model.addAttribute("erro", "E-mail ou matrícula inválidos.");
            return "htmlRecuperarSenha/recuperarSenha"; // <-- caminho corrigido
        }

        model.addAttribute("idProfessor", professor.getIdProfessor());

        return "htmlRecuperarSenha/nova-senha"; // <-- caminho corrigido
    }

    @PostMapping("/alterar-senha")
    public String alterar(
            @RequestParam int idProfessor,
            @RequestParam String senha,
            @RequestParam String confirmar,
            Model model) {

        if (!senha.equals(confirmar)) {
            model.addAttribute("erro", "As senhas não coincidem.");
            model.addAttribute("idProfessor", idProfessor);
            return "htmlRecuperarSenha/nova-senha"; // <-- caminho corrigido
        }

        professorService.atualizarSenha(idProfessor, senha);

        return "redirect:/tela/login";
    }
}

