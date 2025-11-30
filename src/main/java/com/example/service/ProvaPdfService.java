package com.example.service;

import java.io.ByteArrayOutputStream;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.model.Questao;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;

@Service
public class ProvaPdfService {

	//Metodo para gerar a prova em PDF
    public byte[] gerarProvaPdf(String cabecalho, List<Questao> questoes) {

        ByteArrayOutputStream pdfOutput = new ByteArrayOutputStream();
        Document document = new Document();

        try {
            PdfWriter.getInstance(document, pdfOutput);
            document.open();

            // Cabeçalho da Prova
            Font tituloFont = new Font(Font.HELVETICA, 16, Font.BOLD);
            Paragraph titulo = new Paragraph(cabecalho, tituloFont);
            titulo.setAlignment(Element.ALIGN_CENTER);
            titulo.setSpacingAfter(20);
            document.add(titulo);

            // Listagem de Questões
            int numero = 1;
            for (Questao q : questoes) {

                document.add(new Paragraph(numero + ") " + q.getTextQuestao()));
                document.add(new Paragraph("A) " + q.getAlterA()));
                document.add(new Paragraph("B) " + q.getAlterB()));
                document.add(new Paragraph("C) " + q.getAlterC()));
                document.add(new Paragraph("D) " + q.getAlterD()));
                document.add(new Paragraph("E) " + q.getAlterE()));

                document.add(new Paragraph("\n"));
                numero++;
            }

            document.close();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return pdfOutput.toByteArray();
    }
    
    //Metodo para gerar um arquivo extra somente com o gabarito das questões
    public byte[] gerarGabaritoPdf(List<Questao> questoes) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Document document = new Document();
            PdfWriter.getInstance(document, baos);
            document.open();

            document.add(new Paragraph("Gabarito"));
            document.add(new Paragraph("-------------------------"));
            document.add(new Paragraph(" "));

            int num = 1;
            for (Questao q : questoes) {
                document.add(new Paragraph(num + ") " + q.getResposta()));
                num++;
            }

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar gabarito", e);
        }
    }
}

