package com.example.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

import com.example.dto.QuestaoDTO;
import com.example.dto.QuestaoResponseDTO;
import com.example.model.Disciplina;
import com.example.model.Questao;
import com.example.repository.DisciplinaRepository;
import com.example.repository.ProfessorRepository;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@RestController
@CrossOrigin("*")
@RequestMapping("/questao")  // base para todos os endpoints
public class QuestaoController {

	 @Autowired
	 private com.example.service.QuestaoService questaoService;
	
	 @Autowired
	 private DisciplinaRepository disciplinaRepository;
	 
	 @Autowired
	 private ProfessorRepository professorRepository;

	
	//Lista todas as Questoes cadastrados
	 @GetMapping("/list")
	 public List<QuestaoResponseDTO> listar() {
	     return questaoService.ListarTodos().stream().map(q -> {

	         QuestaoResponseDTO dto = new QuestaoResponseDTO();

	         dto.setIdQuestao(q.getIdQuestao());
	         dto.setTextQuestao(q.getTextQuestao());
	         dto.setAlterA(q.getAlterA());
	         dto.setAlterB(q.getAlterB());
	         dto.setAlterC(q.getAlterC());
	         dto.setAlterD(q.getAlterD());
	         dto.setAlterE(q.getAlterE());
	         dto.setResposta(q.getResposta());

	         if (q.getDisciplina() != null) {
	             dto.setDisciplina(q.getDisciplina());
	         } else {
	        	 if (q.getDisciplina() != null) {
	        		    dto.setDisciplina(q.getDisciplina());
	        		} else {
	        		    Integer idDisc = q.getIdDisciplina();
	        		    if (idDisc != null) {
	        		        disciplinaRepository.findById(idDisc)
	        		                .ifPresent(dto::setDisciplina);
	        		    }
	        		}
	         }

	         dto.setIdProfessor(q.getIdProfessor());

	         Integer idProf = q.getIdProfessor();
	         if (idProf != null && idProf > 0) {
	             professorRepository.findById(idProf)
	                     .ifPresent(p -> dto.setNomeProfessor(p.getNomeProfessor()));
	         }

	         return dto;

	     }).toList();
	 }
	
	
	//Busca a Questao pelo ID
	@GetMapping("/{id}")
	public ResponseEntity<Questao> BuscarPorId(@PathVariable int id) {
	    Questao quest = questaoService.GetByidQuestao(id);
	    if (quest != null) {
	        return ResponseEntity.ok(quest);
	    }
	    return ResponseEntity.notFound().build();
	}
	
	//Salva uma nova Questao no banco de dados utilizando metodo salvarQuestao do Service
	@PostMapping("/salvar")
	public ResponseEntity<?> criar(
	        @Valid @RequestBody QuestaoDTO dto,
	        HttpSession session) {
		
		
		Integer idProfessor = (Integer) session.getAttribute("idProfessor");

	    if (idProfessor == null) {
	        return ResponseEntity.status(401).build(); // Não está logado
	     // força o id vir da sessão e não do front
	        
	    }
	    dto.setIdProfessor(idProfessor);
	    
		try {

		    Questao quest = questaoService.SalvarQuestao(dto);
		       return ResponseEntity.ok(quest);
	    }
	    catch (RuntimeException ex) {
	        // Retorna apenas a mensagem limpa
	        return ResponseEntity
	                .badRequest()
	                .body(ex.getMessage());
	    }
	  }
    
  //Exclui a Questao pelo seu id 
    @DeleteMapping("/excluir/{idQuestao}")
    public ResponseEntity<Void> excluir(@PathVariable int idQuestao) {
        Questao quest = questaoService.GetByidQuestao(idQuestao);
        if (quest == null) {
            return ResponseEntity.notFound().build();
        }

        questaoService.ExcluirQuestao(idQuestao);
        return ResponseEntity.noContent().build();
    }
    
    //Atualiza a questao pelo seu Id
    @PutMapping("/atualizar/{idQuestao}")
    public ResponseEntity<Questao> atualizar(
            @PathVariable int idQuestao,
            @Valid @RequestBody QuestaoDTO dto,
            HttpSession session) {

        Integer idProfessor = (Integer) session.getAttribute("idProfessor");
        if (idProfessor != null) {
            dto.setIdProfessor(idProfessor); // força usar idProfessor da sessão
        }

        Optional<Questao> atualizado = questaoService.AtualizarQuestao(idQuestao, dto);
        return atualizado
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
	
    //Carrega as disciplinas registadas nas questões
    @SuppressWarnings("unchecked")
	@GetMapping("/carregarDisciplinas")
    public ResponseEntity<List<Disciplina>> carregarDisciplinas(HttpSession session) {
        List<Integer> ids = (List<Integer>) session.getAttribute("idsDisciplinas");

        if (ids == null || ids.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }

        List<Disciplina> disciplinas = disciplinaRepository.findAllById(ids);
        return ResponseEntity.ok(disciplinas);
    }
    
    //Verifica qual professor esta logado no sistema e traz seu ID
    @GetMapping("/professor/sessao")
    public Map<String, Object> getProfessorSessao(HttpSession session) {

        Integer idProfessor = (Integer) session.getAttribute("idProfessor");

        Map<String, Object> resp = new HashMap<>();
        resp.put("idProfessor", idProfessor); // aceita null sem quebrar

        return resp;
    }
	
	
}
