package com.example.demo.Controllers;

import com.example.demo.Modelos.DAO.IClienteDao;
import com.example.demo.Modelos.Entity.Cliente;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para la entidad Cliente.
 *
 * CAMBIO: El controlador original solo tenía un endpoint raíz que devolvía HTML
 * en texto plano.
 * Se reemplazó por un controlador REST real con CRUD básico.
 * CAMBIO: Se prefijó con /api/cliente para seguir la convención del proyecto.
 */
@RestController
@RequestMapping("/api/cliente")
public class ClienteController {

    @Autowired
    private IClienteDao clienteDao;

    /**
     * GET /api/cliente → Lista todos los clientes (solo ADMIN)
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Cliente> getAllClientes() {
        return clienteDao.findAll();
    }

    /**
     * GET /api/cliente/{id} → Obtiene un cliente por cédula
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SuppressWarnings("null")
    public ResponseEntity<Cliente> getClienteById(@PathVariable Long id) {
        return clienteDao.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
