package com.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import com.example.filter.SessionFilter; 

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // Registra o SessionFilter para tratar o redirecionamento inicial para login
    // baseada na Session/Cookie antes que o Spring Security atue.
    @Bean
    public FilterRegistrationBean<SessionFilter> sessionFilterRegistration() {
        FilterRegistrationBean<SessionFilter> registration = new FilterRegistrationBean<>();
        
        // Garante que o SessionFilter seja gerenciado pelo Spring
        registration.setFilter(new SessionFilter()); 
        
        // Aplica o filtro a todas as rotas (/**)
        registration.addUrlPatterns("/*"); 
        
        // Ordem 1: Deve ser o primeiro a verificar se o usuário está logado na sessão
        registration.setOrder(1); 
        return registration;
    }

    /* * REMOVIDO: FilterRegistrationBean para AuthorizationFilter.
     * O AuthorizationFilter deve ser injetado e adicionado 
     * à cadeia de segurança do Spring (SecurityConfig) para que as regras
     * hasRole() funcionem corretamente após ele ser executado.
     */
}
