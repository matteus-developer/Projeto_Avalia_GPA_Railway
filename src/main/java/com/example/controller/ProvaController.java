package com.example.controller;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.model.Disciplina;
import com.example.model.Professor;
import com.example.model.Questao;
import com.example.repository.QuestaoRepository;
import com.example.service.ProvaPdfService;
import com.example.service.ProfessorService;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/prova")
public class ProvaController {

    @Autowired
    private QuestaoRepository questaoRepository;

    @Autowired
    private ProvaPdfService provaPdfService;

    @Autowired
    private ProfessorService professorService;

    // ===========================================================
    // TELA DE SELEÇÃO DA PROVA
    // ===========================================================
    @GetMapping("/selecionar")
    public String mostrarTelaSelecao(HttpSession session, Model model) {

        Integer idProfessor = (Integer) session.getAttribute("idProfessor");

        if (idProfessor == null) {
            return "redirect:/login";
        }

        Professor professor = professorService.GetByidProfessor(idProfessor);

        if (professor == null) {
            return "redirect:/login";
        }

        // ------------------------------
        // 1) Transformar disciplinas em DTO
        // ------------------------------
        List<Map<String, Object>> disciplinasDTO =
                professor.getDisciplinas().stream().map(d -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("idDisciplina", d.getIdDisciplina());
                    map.put("nomeDisciplina", d.getNomeDisciplina());
                    return map;
                }).collect(Collectors.toList());

        model.addAttribute("disciplinasProfessor", disciplinasDTO);

        // ------------------------------
        // 2) Transformar questões em DTO
        // ------------------------------
        List<Questao> questoes = questaoRepository.findAll();

        List<Map<String, Object>> questoesDTO = questoes.stream().map(q -> {

            Map<String, Object> map = new HashMap<>();
            map.put("idQuestao", q.getIdQuestao());
            map.put("textQuestao", q.getTextQuestao());
            map.put("alterA", q.getAlterA());
            map.put("alterB", q.getAlterB());
            map.put("alterC", q.getAlterC());
            map.put("alterD", q.getAlterD());
            map.put("alterE", q.getAlterE());
            map.put("idProfessor", q.getIdProfessor());

            Disciplina d = q.getDisciplina();
            Map<String, Object> disc = new HashMap<>();
            disc.put("idDisciplina", d.getIdDisciplina());
            disc.put("nomeDisciplina", d.getNomeDisciplina());
            map.put("disciplina", disc);

            return map;

        }).collect(Collectors.toList());

        model.addAttribute("questoes", questoesDTO);

        return "selecionarProva";
    }

    // ===========================================================
    // GERAÇÃO DA PROVA + GABARITO EM ZIP
    // ===========================================================
    @PostMapping("/gerar")
    public ResponseEntity<byte[]> gerarProva(
            @RequestParam("cabecalho") String cabecalho,
            @RequestParam("questoesSelecionadas") List<Integer> ids) {

        List<Questao> questoes = questaoRepository.findAllById(ids);

        // 1) PDF da Prova
        byte[] provaPdf = provaPdfService.gerarProvaPdf(cabecalho, questoes);

        // 2) PDF do Gabarito
        byte[] gabaritoPdf = provaPdfService.gerarGabaritoPdf(questoes);

        // 3) Criar ZIP
        try {
            ByteArrayOutputStream zipBaos = new ByteArrayOutputStream();
            ZipOutputStream zipOut = new ZipOutputStream(zipBaos);

            zipOut.putNextEntry(new ZipEntry("prova.pdf"));
            zipOut.write(provaPdf);
            zipOut.closeEntry();

            zipOut.putNextEntry(new ZipEntry("gabarito.pdf"));
            zipOut.write(gabaritoPdf);
            zipOut.closeEntry();

            zipOut.close();

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=prova_e_gabarito.zip")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(zipBaos.toByteArray());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }
}


