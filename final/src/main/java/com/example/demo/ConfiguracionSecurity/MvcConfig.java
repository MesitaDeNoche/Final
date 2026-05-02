package com.example.demo.ConfiguracionSecurity;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
@Configuration
public class MvcConfig implements WebMvcConfigurer{

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {

        registry.addViewController("/home").setViewName("Login/home");
        registry.addViewController("/indexAdmin").setViewName("UserAdmin/indexAdmin");
        registry.addViewController("/login").setViewName("Login/login");
    } 
    
}
