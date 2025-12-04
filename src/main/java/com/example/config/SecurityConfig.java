package com.example.config;

import com.example.filter.AuthorizationFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private AuthorizationFilter authorizationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            
            .authorizeHttpRequests(authorize -> authorize
                // Rotas Públicas
                .requestMatchers(
                    "/", 
                    "/tela/login", 
                    "/login",
                    "/tela/acesso-negado",
                    "/css/**",
                    "/js/**",
                    "/images/**"
                ).permitAll()

                // ============================================
                // ROTAS RESTRITAS AO COORDENADOR (tipoProfessor = 1)
                // ============================================
                .requestMatchers(HttpMethod.POST, "/professor/salvar").hasRole("COORDENADOR")
                .requestMatchers(HttpMethod.PUT, "/professor/atualizar/**").hasRole("COORDENADOR")
                .requestMatchers(HttpMethod.DELETE, "/professor/excluir/**").hasRole("COORDENADOR")
                .requestMatchers("/tela/professor", "/tela/disciplina").hasRole("COORDENADOR")

                // QUALQUER OUTRA ROTA: Exige autenticação
                .anyRequest().authenticated()
            )
            
            // IMPORTANTE: Adiciona seu filtro customizado ANTES do filtro padrão
            .addFilterBefore(authorizationFilter, UsernamePasswordAuthenticationFilter.class)
            
            .exceptionHandling(exceptions -> exceptions
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    // Se for requisição AJAX/API, retorna JSON
                    if (request.getHeader("X-Requested-With") != null) {
                        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                        response.setContentType("application/json");
                        response.getWriter().write("{\"error\": \"Acesso negado: apenas coordenadores podem acessar esta rota\"}");
                    } else {
                        // Se for requisição de página, redireciona
                        response.sendRedirect(request.getContextPath() + "/tela/acesso-negado");
                    }
                })
                .authenticationEntryPoint((request, response, authException) -> {
                    response.sendRedirect(request.getContextPath() + "/tela/login");
                })
            );
            
        return http.build();
    }
}
