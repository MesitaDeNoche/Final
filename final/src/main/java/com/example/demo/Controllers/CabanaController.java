package com.example.demo.Controllers;

import com.example.demo.Modelos.DAO.ICabanaDao;
import com.example.demo.Modelos.DAO.IEntretenimientoDao;
import com.example.demo.Modelos.DAO.IEmpleadoDao;
import com.example.demo.Modelos.Entity.Cabana;
import com.example.demo.Modelos.Entity.Empleado;
import com.example.demo.Modelos.Entity.Entretenimiento;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cabana")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class CabanaController {

    @Autowired
    private ICabanaDao cabanaDao;
    @Autowired
    private IEntretenimientoDao entretenimientoDao;
    @Autowired
    private IEmpleadoDao empleadoDao;

    @GetMapping
    public List<Cabana> getAll() {
        return cabanaDao.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cabana> getById(@PathVariable Long id) {
        return cabanaDao.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Cabana> create(@RequestBody Map<String, Object> body) {
        Cabana c = buildFromBody(new Cabana(), body);
        c.setId(null);
        return ResponseEntity.status(HttpStatus.CREATED).body(cabanaDao.save(c));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cabana> update(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return cabanaDao.findById(id).map(existing -> {
            buildFromBody(existing, body);
            existing.setId(id);
            return ResponseEntity.ok(cabanaDao.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!cabanaDao.existsById(id))
            return ResponseEntity.notFound().build();
        cabanaDao.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/zona/{zona}")
    public List<Cabana> getByZona(@PathVariable String zona) {
        return cabanaDao.findByZonaIgnoreCase(zona);
    }

    @GetMapping("/categoria/{categoria}")
    public List<Cabana> getByCategoria(@PathVariable String categoria) {
        return cabanaDao.findByCategoriaIgnoreCase(categoria);
    }

    // ── Helper: construye Cabana desde el body Map ───────────────
    // El body puede contener campos simples (zona, categoria, etc) y también relaciones (entretenimientoIds, empleadoIds)
    private Cabana buildFromBody(Cabana c, Map<String, Object> body) {
        if (body.containsKey("zona"))
            c.setZona(body.get("zona").toString());
        if (body.containsKey("categoria"))
            c.setCategoria(body.get("categoria").toString());
        if (body.containsKey("cantidadPersonas"))
            c.setCantidadPersonas(Integer.valueOf(body.get("cantidadPersonas").toString()));
        if (body.containsKey("precioNoche"))
            c.setPrecioNoche(Double.valueOf(body.get("precioNoche").toString()));
        if (body.containsKey("fotoUrl"))
            c.setFotoUrl(body.get("fotoUrl").toString());
        if (body.containsKey("descripcion"))
            c.setDescripcion(body.get("descripcion").toString());

        // Relación entretenimientos: viene como lista de IDs [1, 2, 3]
        if (body.containsKey("entretenimientoIds")) {
            @SuppressWarnings("unchecked")
            List<Integer> ids = (List<Integer>) body.get("entretenimientoIds");
            List<Entretenimiento> ents = ids.stream()
                    .map(id -> entretenimientoDao.findById(Long.valueOf(id)).orElse(null))
                    .filter(e -> e != null)
                    .toList();
            c.setEntretenimientos(ents);
        }

        // Relación empleados: viene como lista de cédulas [1001, 1002]
        if (body.containsKey("empleadoIds")) {
            @SuppressWarnings("unchecked")
            List<Integer> ids = (List<Integer>) body.get("empleadoIds");
            List<Empleado> emps = ids.stream()
                    .map(id -> empleadoDao.findById(Long.valueOf(id)).orElse(null))
                    .filter(e -> e != null)
                    .toList();
            c.setEmpleados(emps);
        }
        return c;
    }
}
