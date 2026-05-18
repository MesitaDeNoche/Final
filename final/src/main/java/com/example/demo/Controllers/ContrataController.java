package com.example.demo.Controllers;

import com.example.demo.Modelos.DAO.IContrataDao;
import com.example.demo.Modelos.DAO.ICabanaDao;
import com.example.demo.Modelos.DAO.IClienteDao;
import com.example.demo.Modelos.DAO.IUsuarioDao;
import com.example.demo.Modelos.Entity.Contrata;
import com.example.demo.Modelos.Entity.Cabana;
import com.example.demo.Modelos.Entity.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/contrata")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:5173",
        "https://marazulfront.onrender.com"
})
public class ContrataController {

    @Autowired private IContrataDao contrataDao;
    @Autowired private ICabanaDao   cabanaDao;
    @Autowired private IClienteDao  clienteDao;
    @Autowired private IUsuarioDao  usuarioDao;

    /**
     * Convierte una Contrata a Map simple para evitar LazyInitializationException
     * al serializar relaciones LAZY fuera de la transacción.
     */
    private Map<String, Object> toMap(Contrata c) {
        Cabana cab = c.getCabana();
        Map<String, Object> cabanaMap = cab != null ? Map.of(
            "id",          cab.getId(),
            "zona",        cab.getZona()        != null ? cab.getZona()        : "",
            "categoria",   cab.getCategoria()   != null ? cab.getCategoria()   : "",
            "precioNoche", cab.getPrecioNoche()  != null ? cab.getPrecioNoche() : 0.0,
            "fotoUrl",     cab.getFotoUrl()      != null ? cab.getFotoUrl()     : ""
        ) : Map.of();

        Map<String, Object> clienteMap = c.getCliente() != null ? Map.of(
            "cedula",   c.getCliente().getCedula(),
            "nombre",   c.getCliente().getNombre()   != null ? c.getCliente().getNombre()   : "",
            "apellido", c.getCliente().getApellido() != null ? c.getCliente().getApellido() : ""
        ) : Map.of();

        return Map.of(
            "idContrata",  c.getIdContrata(),
            "fechaInicio", c.getFechaInicio().toString(),
            "cantDias",    c.getCantDias(),
            "numPersonas", c.getNumPersonas(),
            "cabana",      cabanaMap,
            "cliente",     clienteMap
        );
    }

    /** GET /api/contrata → todas las reservas (ADMIN) */
    @GetMapping
    public ResponseEntity<?> getAll() {
        try {
            List<Map<String, Object>> result = contrataDao.findAll()
                    .stream().map(this::toMap).collect(Collectors.toList());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    /** GET /api/contrata/mis-reservas?username=xxx → reservas del cliente logueado */
    @GetMapping("/mis-reservas")
    public ResponseEntity<?> getMisReservas(@RequestParam String username) {
        try {
            Optional<Usuario> usuarioOpt = usuarioDao.findByUsername(username);
            if (usuarioOpt.isEmpty() || usuarioOpt.get().getCliente() == null) {
                return ResponseEntity.status(404).body(Map.of("error", "Cliente no encontrado"));
            }
            Long cedula = usuarioOpt.get().getCliente().getCedula();
            List<Map<String, Object>> result = contrataDao.findByClienteCedula(cedula)
                    .stream().map(this::toMap).collect(Collectors.toList());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    /** POST /api/contrata → crear una reserva */
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> body) {
        try {
            Long cabanaId       = Long.valueOf(body.get("cabanaId").toString());
            String username     = body.get("username").toString();
            Integer numPersonas = Integer.valueOf(body.get("numPersonas").toString());
            LocalDate fechaInicio = LocalDate.parse(body.get("fechaInicio").toString());
            Integer cantDias    = Integer.valueOf(body.get("cantDias").toString());

            Cabana cabana = cabanaDao.findById(cabanaId)
                    .orElseThrow(() -> new RuntimeException("Cabaña no encontrada"));

            Usuario usuario = usuarioDao.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            if (usuario.getCliente() == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "El usuario no tiene cliente asociado"));
            }

            if (numPersonas > cabana.getCantidadPersonas()) {
                return ResponseEntity.badRequest().body(
                    Map.of("error", "La cabaña solo admite " + cabana.getCantidadPersonas() + " personas"));
            }

            Contrata contrata = new Contrata();
            contrata.setCabana(cabana);
            contrata.setCliente(usuario.getCliente());
            contrata.setNumPersonas(numPersonas);
            contrata.setFechaInicio(fechaInicio);
            contrata.setCantDias(cantDias);

            Contrata saved = contrataDao.save(contrata);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "idContrata",  saved.getIdContrata(),
                "cabanaId",    cabana.getId(),
                "zona",        cabana.getZona(),
                "fechaInicio", fechaInicio.toString(),
                "cantDias",    cantDias,
                "numPersonas", numPersonas,
                "mensaje",     "Reserva creada con éxito"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /** DELETE /api/contrata/{id} → cancelar reserva */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!contrataDao.existsById(id)) return ResponseEntity.notFound().build();
        contrataDao.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /** GET /api/contrata/stats → estadísticas para el admin */
    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        long totalReservas = contrataDao.count();
        long totalCabanas  = cabanaDao.count();
        long totalClientes = clienteDao.count();
        return ResponseEntity.ok(Map.of(
            "totalReservas", totalReservas,
            "totalCabanas",  totalCabanas,
            "totalClientes", totalClientes
        ));
    }
}
