package com.example.interceptor;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Component
public class AuthInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession session = request.getSession(false);
        String uri = request.getRequestURI();

        // Rotas públicas (não precisam de autenticação)
        if (isPublicRoute(uri)) {
            return true;
        }

        // Verifica se o usuário está logado
        if (session == null || session.getAttribute("idProfessor") == null) {
            response.sendRedirect("/tela/login");
            return false;
        }

        // Verifica se está tentando acessar rotas de coordenador
        if (isCoordinatorRoute(uri)) {
            Byte tipoProfessor = (Byte) session.getAttribute("tipoProfessor");
            
            if (tipoProfessor == null || tipoProfessor != 1) {
                response.sendRedirect("/tela/acesso-negado");
                return false;
            }
        }

        return true;
    }

    private boolean isPublicRoute(String uri) {
        return uri.equals("/") ||
               uri.equals("/tela/login") ||
               uri.equals("/login") ||
               uri.equals("/recuperar-senha") ||
               uri.equals("/alterar-senha") ||
               uri.equals("/tela/acesso-negado") ||
               uri.equals("/tela/recuperarSenha") ||
               uri.equals("/tela/nova-senha") ||
               uri.startsWith("/css/") ||
               uri.startsWith("/js/") ||
               uri.startsWith("/images/") ||
               uri.startsWith("/static/");
    }

    private boolean isCoordinatorRoute(String uri) {
        // Rotas que apenas coordenadores podem acessar
        return uri.equals("/tela/professor") ||
               uri.equals("/tela/disciplina") ||
               uri.startsWith("/professor/") ||
               uri.startsWith("/disciplina/") ||
               uri.equals("/tela/recuperarSenha") ||
               uri.equals("/tela/nova-senha") ||
               uri.startsWith("/coordenador/");
    }
}