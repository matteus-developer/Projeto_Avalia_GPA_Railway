package com.example.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Desabilita CSRF (necessário para formulários funcionarem)
            .csrf(csrf -> csrf.disable())
            
            // Permite acesso a TODAS as rotas sem autenticação do Spring Security
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll()
            )
            
            // Desabilita o formulário de login padrão do Spring Security
            .formLogin(form -> form.disable())
            
            // Desabilita autenticação HTTP Basic
            .httpBasic(basic -> basic.disable());
        
        return http.build();
    }
}