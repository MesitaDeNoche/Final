package com.example.demo.ConfiguracionSecurity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import Services.UsuarioService;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    @Autowired
    private UsuarioService usuarioService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @SuppressWarnings("deprecation")
    @Bean
    public DaoAuthenticationProvider authProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(usuarioService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authenticationProvider(authProvider())
				.authorizeHttpRequests(requests -> requests
						.requestMatchers("/", "/home", "/login", "/registro").permitAll()
						.requestMatchers("/indexAdmin/**").hasRole("ADMIN")
						.requestMatchers("/indexCliente/**").hasRole("CLIENTE")
						.requestMatchers("/cliente/**").hasRole("CLIENTE")
						.anyRequest().authenticated())
				.formLogin(form -> form
						.loginPage("/login")
						.loginProcessingUrl("/login")
						.successHandler((request, response, authentication) -> {
							boolean esAdmin = authentication.getAuthorities().stream()
									.anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
							if (esAdmin) {
								response.sendRedirect("/indexAdmin");
							} else {
								response.sendRedirect("/indexCliente");
							}
						})
						.permitAll())
				.logout(logout -> logout
						.logoutUrl("/logout")
						.logoutSuccessUrl("/")
						.invalidateHttpSession(true) // ← invalida la sesión
						.clearAuthentication(true) // ← limpia credenciales
						.deleteCookies("JSESSIONID") // ← elimina la cookie de sesión
						.permitAll());

        return http.build();
    }

}
