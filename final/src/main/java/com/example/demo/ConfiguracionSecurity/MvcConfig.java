package com.example.demo.ConfiguracionSecurity;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuración MVC: rutas simples y CORS para el frontend React.
 * Los orígenes permitidos se leen desde la variable de entorno
 * CORS_ALLOWED_ORIGINS (lista separada por comas).
 */
@Configuration
public class MvcConfig implements WebMvcConfigurer {

    /**
     * En desarrollo: http://localhost:5173,http://localhost:3000
     * En producción: la URL de Vercel (ej. https://marazul.vercel.app)
     * Se configura vía variable de entorno CORS_ALLOWED_ORIGINS.
     */
    @Value("${app.cors.allowed-origins:http://localhost:5173,http://localhost:3000}")
    private String[] allowedOrigins;

    @Override
    @SuppressWarnings("null")
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/home").setViewName("Login/home");
        registry.addViewController("/indexAdmin").setViewName("UserAdmin/indexAdmin");
        registry.addViewController("/login").setViewName("Login/login");
        registry.addViewController("/registro").setViewName("Login/registro");
        registry.addViewController("/indexCliente").setViewName("UserCliente/indexCliente");
    }

    @Override
    @SuppressWarnings("null")
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(allowedOrigins)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
