package com.example.demo.ConfiguracionSecurity;

import com.example.demo.Services.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Configuración de Spring Security.
 *
 * - /api/auth/** → público (login y registro no requieren autenticación)
 * - /api/** → requiere autenticación
 * - CSRF desactivado para la API REST (el frontend no usa cookies de sesión)
 */
@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    @Autowired
    private UsuarioService usuarioService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {
                })
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET,    "/api/cabana/**").permitAll()
                        .requestMatchers(HttpMethod.GET,    "/api/entretenimiento/**").permitAll()
                        // Reservas: el frontend gestiona sesión en React (sin HTTP session)
                        // La validación de usuario se hace por username en el body
                        .requestMatchers("/api/contrata/**").permitAll()
                        .requestMatchers(HttpMethod.GET,    "/api/contrata/stats").permitAll()
                        .requestMatchers(HttpMethod.GET,    "/api/cliente/**").permitAll()
                        .requestMatchers(HttpMethod.POST,   "/api/cabana/**").permitAll()
                        .requestMatchers(HttpMethod.PUT,    "/api/cabana/**").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/api/cabana/**").permitAll()
                        .anyRequest().permitAll())
                .userDetailsService(usuarioService)
                .httpBasic(basic -> basic.disable())
                .formLogin(form -> form.disable());

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
