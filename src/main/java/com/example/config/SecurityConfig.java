@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private AuthorizationFilter authorizationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Desabilitar apenas se necessário
            .cors(cors -> cors.configure(http))
            .authorizeHttpRequests(auth -> auth
                // Rotas públicas (login, etc)
                .requestMatchers("/tela/login**").permitAll()
                
                // Rotas específicas do COORDENADOR (tipoUsuario = 1)
                .requestMatchers("/tela/disciplina", "/tela/professor").hasAuthority("COORDENADOR")
                
                
                // Qualquer outra requisição precisa estar autenticada
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            // IMPORTANTE: Adicionar o filtro de autorização ANTES do filtro padrão
            .addFilterBefore(authorizationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
