package com.example.demo.Controllers;

import com.example.demo.DTO.LoginDTO;
import com.example.demo.DTO.RegistroDTO;
import com.example.demo.Modelos.DAO.IUsuarioDao;
import com.example.demo.Modelos.Entity.Usuario;
import com.example.demo.Services.RegistroService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private RegistroService registroService;

    @Autowired
    private IUsuarioDao usuarioDao;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/registro")
    public ResponseEntity<?> registro(@Valid @RequestBody RegistroDTO dto) {
        try {
            registroService.registrarCliente(dto);
            return ResponseEntity.ok(Map.of("mensaje", "Usuario registrado exitosamente"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Compatible con contraseñas en texto plano (datos de prueba en BD)
     * y contraseñas BCrypt (registradas desde el formulario).
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {
        Optional<Usuario> usuarioOpt = usuarioDao.findByUsername(dto.getUsername());

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Usuario no registrado. Por favor crea una cuenta."));
        }

        Usuario usuario = usuarioOpt.get();
        String passwordGuardada = usuario.getPassword();

        // Si empieza con "$2" es BCrypt; de lo contrario, comparación directa (texto
        // plano)
        boolean passwordValida = passwordGuardada.startsWith("$2")
                ? passwordEncoder.matches(dto.getPassword(), passwordGuardada)
                : dto.getPassword().equals(passwordGuardada);

        if (!passwordValida) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Contraseña incorrecta."));
        }

        return ResponseEntity.ok(Map.of(
                "username", usuario.getUsername(),
                "rol", usuario.getRol().name()));
    }
}
