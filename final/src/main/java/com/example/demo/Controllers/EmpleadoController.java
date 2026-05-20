package com.example.demo.Controllers;

import com.example.demo.Modelos.DAO.IEmpleadoDao;
import com.example.demo.Modelos.DAO.ICabanaDao;
import com.example.demo.Modelos.DAO.IUsuarioDao;
import com.example.demo.Modelos.Entity.Empleado;
import com.example.demo.Modelos.Entity.Cabana;
import com.example.demo.Modelos.Entity.Usuario;
import com.example.demo.Modelos.Entity.Usuario.Rol;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/empleado")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class EmpleadoController {

    @Autowired
    private IEmpleadoDao empleadoDao;

    @Autowired
    private ICabanaDao cabanaDao;

    @Autowired
    private IUsuarioDao usuarioDao;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ── GET todos los empleados ──────────────────────────────────
    @GetMapping
    public List<Empleado> getAll() {
        return empleadoDao.findAll();
    }

    // ── GET empleado por cédula ──────────────────────────────────
    @GetMapping("/{cedula}")
    public ResponseEntity<Empleado> getById(@PathVariable Long cedula) {
        return empleadoDao.findById(cedula)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ── POST crear empleado ──────────────────────────────────────
    //Se agregó la creación del usuario asociado al empleado, con validaciones para username y password, y se asigna el rol de EMPLEADO.
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> body) {
        try {
            String username = body.getOrDefault("username", "").toString().trim();
            String password = body.getOrDefault("password", "").toString().trim();
            if (username.isEmpty() || password.isEmpty())
                return ResponseEntity.badRequest().body(Map.of("error", "Username y contraseña son obligatorios"));
            if (usuarioDao.findByUsername(username).isPresent())
                return ResponseEntity.badRequest().body(Map.of("error", "El username ya está en uso"));

            Empleado e = buildFromBody(new Empleado(), body);
            e.setCedula(null);
            Empleado savedEmpleado = empleadoDao.save(e);

            Usuario usuario = new Usuario();
            usuario.setUsername(username);
            usuario.setPassword(passwordEncoder.encode(password));
            usuario.setRol(Rol.EMPLEADO);
            usuario.setEmail(savedEmpleado.getEmail());
            usuario.setCreatedAt(java.time.LocalDate.now());
            usuario.setEmpleado(savedEmpleado);
            usuarioDao.save(usuario);

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "cedula", savedEmpleado.getCedula(),
                    "username", username,
                    "mensaje", "Empleado y usuario creados correctamente"));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    // ── PUT actualizar empleado ──────────────────────────────────
    @PutMapping("/{cedula}")
    public ResponseEntity<?> update(@PathVariable Long cedula, @RequestBody Map<String, Object> body) {
        return empleadoDao.findById(cedula).map(existing -> {
            try {
                buildFromBody(existing, body);
                existing.setCedula(cedula);
                return ResponseEntity.ok(empleadoDao.save(existing));
            } catch (Exception ex) {
                return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
            }
        }).orElse(ResponseEntity.notFound().build());
    }

    // ── DELETE eliminar empleado ─────────────────────────────────
    @DeleteMapping("/{cedula}")
    public ResponseEntity<Void> delete(@PathVariable Long cedula) {
        if (!empleadoDao.existsById(cedula))
            return ResponseEntity.notFound().build();
        empleadoDao.deleteById(cedula);
        return ResponseEntity.noContent().build();
    }

    // ── GET cabañas asignadas a un empleado ──────────────────────
    @GetMapping("/{cedula}/cabanas")
    public ResponseEntity<?> getCabanasByEmpleado(@PathVariable Long cedula) {
        return empleadoDao.findById(cedula)
                .map(e -> ResponseEntity.ok(cabanaDao.findByEmpleadosCedula(cedula)))
                .orElse(ResponseEntity.notFound().build());
    }

    // ── POST asignar empleado a cabaña ───────────────────────────
    @PostMapping("/{cedula}/cabanas/{cabanaId}")
    public ResponseEntity<?> asignarACabana(@PathVariable Long cedula, @PathVariable Long cabanaId) {
        Empleado emp = empleadoDao.findById(cedula).orElse(null);
        if (emp == null)
            return ResponseEntity.notFound().build();

        Cabana cab = cabanaDao.findById(cabanaId).orElse(null);
        if (cab == null)
            return ResponseEntity.notFound().build();

        List<Empleado> empleados = cab.getEmpleados();
        boolean yaAsignado = empleados != null && empleados.stream()
                .anyMatch(e -> e.getCedula().equals(cedula));
        if (yaAsignado)
            return ResponseEntity.badRequest().body(Map.of("error", "El empleado ya está asignado a esta cabaña."));

        if (empleados == null) {
            cab.setEmpleados(new java.util.ArrayList<>());
        }
        cab.getEmpleados().add(emp);
        cabanaDao.save(cab);
        return ResponseEntity.ok(Map.of("mensaje", "Empleado asignado correctamente."));
    }

    // ── DELETE desasignar empleado de cabaña ─────────────────────
    @DeleteMapping("/{cedula}/cabanas/{cabanaId}")
    public ResponseEntity<?> desasignarDeCabana(@PathVariable Long cedula, @PathVariable Long cabanaId) {
        Cabana cab = cabanaDao.findById(cabanaId).orElse(null);
        if (cab == null)
            return ResponseEntity.notFound().build();

        if (cab.getEmpleados() != null) {
            cab.getEmpleados().removeIf(e -> e.getCedula().equals(cedula));
            cabanaDao.save(cab);
        }
        return ResponseEntity.ok(Map.of("mensaje", "Empleado desasignado correctamente."));
    }

    // ── Helper: construye Empleado desde el body Map ─────────────
    //Se agegaron los campos faltantes de empleado, incluyendo el campo de coordinador que es un select con opciones "Es coordinador" y "No es coordinador".
    private Empleado buildFromBody(Empleado e, Map<String, Object> body) {
        if (body.containsKey("nombre"))
            e.setNombre(body.get("nombre").toString());
        if (body.containsKey("apellido"))
            e.setApellido(body.get("apellido").toString());
        if (body.containsKey("email"))
            e.setEmail(body.get("email").toString());
        if (body.containsKey("telefono"))
            e.setTelefono(body.get("telefono").toString());
        if (body.containsKey("fechaNacimiento"))
            e.setFechaNacimiento(LocalDate.parse(body.get("fechaNacimiento").toString()));
        if (body.containsKey("salario"))
            e.setSalario(new BigDecimal(body.get("salario").toString()));
        if (body.containsKey("descripcion"))
            e.setDescripcion(body.get("descripcion").toString());
        if (body.containsKey("idiomas"))
            e.setIdiomas(body.get("idiomas").toString());
        if (body.containsKey("esCoordinador")) {
            boolean esCoord = Boolean.parseBoolean(body.get("esCoordinador").toString());
            e.setEsCoordinador(esCoord ? "Es coordinador" : null);
        }
        return e;
    }
}
