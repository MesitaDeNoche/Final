package com.example.demo.Controllers;

import com.example.demo.Modelos.DAO.IEntretenimientoDao;
import com.example.demo.Modelos.Entity.Entretenimiento;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entretenimiento")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class EntretenimientoController {

    @Autowired
    private IEntretenimientoDao entretenimientoDao;

    @GetMapping
    public List<Entretenimiento> getAll() {
        return entretenimientoDao.findAll();
    }

    @PostMapping
    public ResponseEntity<Entretenimiento> create(@RequestBody Entretenimiento e) {
        e.setId(null);
        return ResponseEntity.status(HttpStatus.CREATED).body(entretenimientoDao.save(e));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!entretenimientoDao.existsById(id)) return ResponseEntity.notFound().build();
        entretenimientoDao.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
