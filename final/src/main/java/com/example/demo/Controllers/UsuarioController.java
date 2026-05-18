package com.example.demo.Controllers;

import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "http://localhost:8070")
public class UsuarioController {

    @GetMapping
    public List<String> getUsuarios() {
        return Arrays.asList("Juan", "Maria", "Carlos");
    }
}