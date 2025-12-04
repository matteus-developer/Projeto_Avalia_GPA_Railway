package com.example.filter;

import com.example.model.Professor;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Component
public class AuthorizationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                   HttpServletResponse response, 
                                   FilterChain filterChain) throws ServletException, IOException {
        
        String uri = request.getRequestURI();
        
        // Adicione LOGS para debug - REMOVA DEPOIS
        System.out.println("===========================================");
        System.out.println("🔍 AuthorizationFilter executando");
        System.out.println("📍 URI: " + uri);
        System.out.println("🔧 Método: " + request.getMethod());
        
        // Permite rotas públicas SEM verificar sessão
        if (isPublicRoute(uri)) {
            System.out.println("✅ Rota pública - permitindo acesso");
            filterChain.doFilter(request, response);
            return;
        }
        
        // Recupera a sessão
        HttpSession session = request.getSession(false);
        
        if (session == null) {
            System.out.println("❌ Sessão não existe - redirecionando para login");
            response.sendRedirect(request.getContextPath() + "/tela/login");
            return;
        }
        
        // Recupera o professor logado da sessão
        Professor professorLogado = (Professor) session.getAttribute("professorLogado");
        
        if (professorLogado == null) {
            System.out.println("❌ Professor não está na sessão - redirecionando para login");
            response.sendRedirect(request.getContextPath() + "/tela/login");
            return;
        }
        
        // Extrai o tipo do professor
        byte tipoByte = professorLogado.getTipoProfessor();
        String role = tipoByte == 1 ? "COORDENADOR" : "PROFESSOR";
        
        System.out.println("👤 Professor logado: " + professorLogado.getEmailProfessor());
        System.out.println("🎭 Tipo byte: " + tipoByte);
        System.out.println("🎭 Role: " + role);
        
        // VERIFICAÇÃO CRÍTICA: Bloqueia professores em rotas de coordenador
        if (isCoordenaorRoute(uri) && tipoByte != 1) {
            System.out.println("🚫 BLOQUEADO: Professor tentando acessar rota de coordenador");
            System.out.println("🚫 Tipo do usuário: " + tipoByte + " (esperado: 1)");
            
            // Se for requisição AJAX/API, retorna JSON
            if ("XMLHttpRequest".equals(request.getHeader("X-Requested-With")) || 
                uri.startsWith("/api/") || uri.startsWith("/professor/")) {
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"error\": \"Acesso negado: apenas coordenadores podem acessar esta rota\", \"tipoUsuario\": " + tipoByte + "}");
            } else {
                // Se for página web, redireciona
                response.sendRedirect(request.getContextPath() + "/tela/acesso-negado");
            }
            return;
        }
        
        // Cria as authorities com o prefixo ROLE_
        List<SimpleGrantedAuthority> authorities = Collections.singletonList(
            new SimpleGrantedAuthority("ROLE_" + role)
        );
        
        // Autentica no contexto do Spring Security
        UsernamePasswordAuthenticationToken authentication = 
            new UsernamePasswordAuthenticationToken(
                professorLogado.getEmailProfessor(),
                null,
                authorities
            );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        System.out.println("✅ Autenticação configurada - prosseguindo");
        System.out.println("===========================================");
        
        // Continua o processamento
        filterChain.doFilter(request, response);
    }
    
    private boolean isPublicRoute(String uri) {
        return uri.equals("/") ||
               uri.equals("/tela/login") ||
               uri.equals("/login") ||
               uri.equals("/tela/acesso-negado") ||
               uri.startsWith("/css/") ||
               uri.startsWith("/js/") ||
               uri.startsWith("/images/");
    }
    
    private boolean isCoordenaorRoute(String uri) {
        // ADICIONE AQUI TODAS AS ROTAS QUE SÓ COORDENADORES PODEM ACESSAR
        return uri.equals("/professor/salvar") ||
               uri.startsWith("/professor/atualizar/") ||
               uri.startsWith("/professor/excluir/") ||
               uri.equals("/tela/professor") ||
               uri.equals("/tela/disciplina");
    }
}
