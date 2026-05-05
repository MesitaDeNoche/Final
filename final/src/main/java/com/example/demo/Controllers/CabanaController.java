package com.example.demo.Controllers;

import com.example.demo.Modelos.DAO.ICabanaDao;
import com.example.demo.Modelos.Entity.Cabana;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para la entidad Cabaña.
 *
 * CAMBIO CRÍTICO: Se reemplazaron cabanaDao.findOne(id) y cabanaDao.delete(id)
 * que NO EXISTEN en Spring Data JPA moderno, por:
 * - cabanaDao.findById(id) → devuelve Optional<Cabana>
 * - cabanaDao.deleteById(id)
 *
 * CAMBIO: Se agregó @RequestMapping("/api/cabana") con prefijo /api para
 * separar la API REST de las rutas de vistas Thymeleaf y facilitar el CORS.
 */
@RestController
@RequestMapping("/api/cabana")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" }) // Orígenes del frontend
public class CabanaController {

    @Autowired
    private ICabanaDao cabanaDao;

    /**
     * GET /api/cabana → Devuelve todas las cabañas
     */
    @GetMapping
    public List<Cabana> getAllCabanas() {
        return cabanaDao.findAll();
    }

    /**
     * GET /api/cabana/{id} → Devuelve una cabaña por ID o 404
     */
    @GetMapping("/{id}")
    @SuppressWarnings("null")
    public ResponseEntity<Cabana> getCabanaById(@PathVariable Long id) {
        return cabanaDao.findById(id) // CAMBIO: findById en lugar de findOne
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/cabana → Crea una nueva cabaña
     */
    @PostMapping
    public ResponseEntity<Cabana> create(@Valid @RequestBody Cabana cabana) {
        cabana.setId(null); // Asegurar que se genere un ID nuevo (no se acepta del cliente)
        Cabana guardada = cabanaDao.save(cabana);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
    }

    /**
     * PUT /api/cabana/{id} → Actualiza una cabaña existente
     */
    @PutMapping("/{id}")
    @SuppressWarnings("null")
    public ResponseEntity<Cabana> update(@PathVariable Long id, @Valid @RequestBody Cabana cabana) {
        if (!cabanaDao.existsById(id)) { // CAMBIO: existsById en lugar de findOne != null
            return ResponseEntity.notFound().build();
        }
        cabana.setId(id);
        Cabana actualizada = cabanaDao.save(cabana);
        return ResponseEntity.ok(actualizada);
    }

    /**
     * DELETE /api/cabana/{id} → Elimina una cabaña
     */
    @DeleteMapping("/{id}")
    @SuppressWarnings("null")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!cabanaDao.existsById(id)) { // CAMBIO: existsById
            return ResponseEntity.notFound().build();
        }
        cabanaDao.deleteById(id); // CAMBIO: deleteById en lugar de delete(id)
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/cabana/zona/{zona} → Filtra por zona (sin distinguir mayúsculas)
     */
    @GetMapping("/zona/{zona}")
    public List<Cabana> getCabanasByZona(@PathVariable String zona) {
        return cabanaDao.findByZonaIgnoreCase(zona);
    }

    /**
     * GET /api/cabana/categoria/{categoria} → Filtra por categoría
     */
    @GetMapping("/categoria/{categoria}")
    public List<Cabana> getCabanasByCategoria(@PathVariable String categoria) {
        return cabanaDao.findByCategoriaIgnoreCase(categoria);
    }
}
