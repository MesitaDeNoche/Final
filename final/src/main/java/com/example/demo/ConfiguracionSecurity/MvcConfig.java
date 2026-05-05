package com.example.demo.ConfiguracionSecurity;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Configuración MVC: rutas simples y CORS para el frontend React.
 *
 * CAMBIO: Se agregó configuración de CORS para permitir que el frontend React
 * en localhost:3000 se comunique con la API.
 */
@Configuration
public class MvcConfig implements WebMvcConfigurer {

    @Override
    @SuppressWarnings("null")
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/home").setViewName("Login/home");
        registry.addViewController("/indexAdmin").setViewName("UserAdmin/indexAdmin");
        registry.addViewController("/login").setViewName("Login/login");
        // CAMBIO: Se agrega la vista de registro
        registry.addViewController("/registro").setViewName("Login/registro");
        // CAMBIO: Se agrega la vista del panel de cliente
        registry.addViewController("/indexCliente").setViewName("UserCliente/indexCliente");
    }

    /**
     * CAMBIO: CORS global para el frontend React en desarrollo.
     * Permite que React (localhost:3000) llame a la API (localhost:8080).
     * Para producción, reemplaza el origen con el dominio real.
     */
    @Override
    @SuppressWarnings("null")
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000", "http://localhost:5173") // React y Vite
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
