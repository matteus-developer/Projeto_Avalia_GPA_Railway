package com.example.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.dto.ProfessorDTO;
import com.example.model.Professor;


import jakarta.validation.Valid;

@RestController
@CrossOrigin("*")
@RequestMapping("/professor")  // base para todos os endpoints
public class ProfessorController {

	@Autowired
	private com.example.service.ProfessorService professorService;
	
			//Lista todos os Professores cadastrados
			@GetMapping("/list")
		    public List<Professor> listar() {
		        return professorService.ListarTodos();
		    }
			
			//Busca o professor pelo ID
			@GetMapping("/{id}")
			public ResponseEntity<Professor> BuscarPorId(@PathVariable int id) {
			    Professor professor = professorService.GetByidProfessor(id);
			    if (professor != null) {
			        return ResponseEntity.ok(professor);
			    }
			    return ResponseEntity.notFound().build();
			}
			
			//Salva um novo Professor no banco de dados utilizando metodo salvarProfessor
			@PostMapping("/salvar")
			public ResponseEntity<?> criar(@Valid @RequestBody ProfessorDTO dto) {
			    try {
			        Professor pro = professorService.SalvarProfessor(dto);
			        return ResponseEntity.status(201).body(pro);

			    } catch (RuntimeException e) {
			        return ResponseEntity
			                .badRequest()
			                .body(e.getMessage());
			    }
			}

		    
		  //Exclui um Professor pelo seu id 
		    @DeleteMapping("/excluir/{idProfessor}")
		    public ResponseEntity<Void> excluir(@PathVariable int idProfessor) {
		        Professor professor = professorService.GetByidProfessor(idProfessor);
		        if (professor == null) {
		            return ResponseEntity.notFound().build();
		        }

		        professorService.ExcluirProfessor(idProfessor);
		        return ResponseEntity.noContent().build();
		    }
		    
			
		  //Atualiza os dados do professor no Banco de dados utilizando o id do Professor
		    @PutMapping("/atualizar/{idProfessor}")
		    public ResponseEntity<Professor> atualizar(
		            @PathVariable int idProfessor,
		            @Valid @RequestBody ProfessorDTO dto) {

		        Optional<Professor> atualizado = professorService.AtualizarProfessor(idProfessor, dto);
		        return atualizado
		                .map(ResponseEntity::ok)
		                .orElse(ResponseEntity.notFound().build());
		    }
			
	
	
}
