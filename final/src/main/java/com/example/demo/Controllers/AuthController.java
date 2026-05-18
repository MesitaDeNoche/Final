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
import java.time.LocalDate;
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

    /**
     * Endpoint de emergencia: crea o resetea el usuario admin.
     * Protegido por una clave secreta en el body.
     * Llamar con: POST /api/auth/setup-admin  { "clave": "marazul-setup-2025" }
     */
    @PostMapping("/setup-admin")
    public ResponseEntity<?> setupAdmin(@RequestBody Map<String, String> body) {
        final String SETUP_KEY = "marazul-setup-2025";
        if (!SETUP_KEY.equals(body.get("clave"))) {
            return ResponseEntity.status(403).body(Map.of("error", "Clave incorrecta."));
        }

        String username = "admin";
        String password = "admin123";
        String email    = "admin@marazul.com";

        Optional<Usuario> existing = usuarioDao.findByUsername(username);
        Usuario admin = existing.orElse(new Usuario());
        admin.setUsername(username);
        admin.setPassword(passwordEncoder.encode(password));
        admin.setRol(Usuario.Rol.ADMIN);
        admin.setEmail(email);
        if (admin.getCreatedAt() == null) admin.setCreatedAt(LocalDate.now());
        usuarioDao.save(admin);

        return ResponseEntity.ok(Map.of(
                "mensaje", "Admin listo.",
                "username", username,
                "password", password));
    }

    /**
     * Endpoint de emergencia: crea o resetea el usuario empleado de prueba.
     * Llamar con: POST /api/auth/setup-empleado  { "clave": "marazul-setup-2025" }
     */
    @PostMapping("/setup-empleado")
    public ResponseEntity<?> setupEmpleado(@RequestBody Map<String, String> body) {
        final String SETUP_KEY = "marazul-setup-2025";
        if (!SETUP_KEY.equals(body.get("clave"))) {
            return ResponseEntity.status(403).body(Map.of("error", "Clave incorrecta."));
        }

        String username = "empleado1";
        String password = "empleado123";
        String email    = "empleado1@marazul.com";

        Optional<Usuario> existing = usuarioDao.findByUsername(username);
        Usuario emp = existing.orElse(new Usuario());
        emp.setUsername(username);
        emp.setPassword(passwordEncoder.encode(password));
        emp.setRol(Usuario.Rol.EMPLEADO);
        emp.setEmail(email);
        if (emp.getCreatedAt() == null) emp.setCreatedAt(LocalDate.now());
        usuarioDao.save(emp);

        return ResponseEntity.ok(Map.of(
                "mensaje", "Empleado listo.",
                "username", username,
                "password", password));
    }
}
