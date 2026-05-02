package com.example.demo.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.demo.Modelos.DAO.Cabana.ICabanaDao;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import com.example.demo.Modelos.Entity.Cabana;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/cabana")
@CrossOrigin(origins = "*") // Permite que cualquier origen se conecte
public class CabanaController {

    @Autowired
    private ICabanaDao cabanaDao;

    @GetMapping
    public List<Cabana> getAllCabanas() {
        return cabanaDao.findAll(); // devuelve todas las cabanas
    }

    // mostrar una cabana por id
    @GetMapping("/{id}")
    public ResponseEntity<Cabana> getCabanaById(@PathVariable Long id) {
        return cabanaDao.findById(id).stream().findFirst() // conversion a optional y luego a response entity
                .map(ResponseEntity::ok) // si existe la cabana, la devuelve con estado 200
                .orElse(ResponseEntity.notFound().build()); // si no existe, devuelve 404
    }

    // crear una cabana
    @PostMapping
    public ResponseEntity<Cabana> create(@Valid @RequestBody Cabana cabana) {
        cabana.setId(null);
        cabanaDao.save(cabana); // Se guarda en la base de datos
        return ResponseEntity.status(HttpStatus.CREATED).body(cabana); // Se devuelve el objeto guardado
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cabana> update(@Valid @PathVariable Long id, @RequestBody Cabana cabana) {
        // Verificamos si existe usando findOne (si devuelve null, no existe)
        if (cabanaDao.findOne(id) == null) {
            return ResponseEntity.notFound().build();
        }
        // Actualizamos el ID y guardamos (sin retornar el save)
        cabana.setId(id);
        cabanaDao.save(cabana);
        // Devolvemos la cabaña guardada
        return ResponseEntity.ok(cabana);
    }

    // borrar una cabana
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        // Verificamos si existe usando findOne (si devuelve null, no existe)
        if (cabanaDao.findOne(id) == null) {
            return ResponseEntity.notFound().build();
        }
        // Eliminamos la cabaña
        cabanaDao.delete(id);
        // Devolvemos 204 No Content (respuesta estándar para eliminaciones exitosas)
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/zona/{zona}")
    public List<Cabana> getCabanasByZona(@PathVariable String zona) {
        return cabanaDao.findByZonaIgnoreCase(zona);
    }

    @GetMapping("/categoria/{categoria}")
    public List<Cabana> getCabanasByCategoria(@PathVariable String categoria) {
        return cabanaDao.findByCategoriaIgnoreCase(categoria);
    }
}