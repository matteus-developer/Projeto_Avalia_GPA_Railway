package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.model.Professor;
import com.example.repository.ProfessorRepository;

@Service
public class LoginService {

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Método para autenticar o professor pela matricula e senha
    public Professor autenticar(String matriProfessor, String senhaProfessor) {

        Professor professor = professorRepository.findBymatriProfessor(matriProfessor);

        if (professor == null) {
            return null;
        }

        // Compara a senha digitada com o hash armazenado no banco
        if (!passwordEncoder.matches(senhaProfessor, professor.getSenhaProfessor())) {
            return null;
        }

        return professor;
    }
}