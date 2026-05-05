package com.example.demo.Services;

import com.example.demo.DTO.RegistroDTO;
import com.example.demo.Modelos.DAO.IClienteDao;
import com.example.demo.Modelos.DAO.IUsuarioDao;
import com.example.demo.Modelos.Entity.Cliente;
import com.example.demo.Modelos.Entity.Usuario;
import com.example.demo.Modelos.Entity.Usuario.Rol;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

/**
 * Servicio que maneja el registro de nuevos clientes.
 *
 * CAMBIO CRÍTICO: Paquete movido de "Services" a "com.example.demo.Services".
 * CAMBIO: Se mejoró el manejo de errores lanzando IllegalArgumentException
 * en lugar de RuntimeException genérico.
 */
@Service
public class RegistroService {

    @Autowired
    private IUsuarioDao usuarioDao;

    @Autowired
    private IClienteDao clienteDao;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Registra un cliente nuevo creando su entidad Persona/Cliente y su cuenta de
     * Usuario.
     * 
     * @Transactional asegura que si falla el guardado del usuario, se revierte
     *                también
     *                el guardado del cliente (operación atómica).
     *
     * @throws IllegalArgumentException si el username o el email ya están en uso
     */
    @Transactional
    public void registrarCliente(RegistroDTO dto) {

        // Validar que el username no exista
        if (usuarioDao.findByUsername(dto.getUsername()).isPresent()) {
            throw new IllegalArgumentException("El username ya está en uso"); // CAMBIO: excepción más específica
        }

        // Validar que el email no exista (unicidad en la tabla personas)
        if (clienteDao.findByCedula(dto.getCedula()).isPresent()) {
            throw new IllegalArgumentException("La cedula ya está registrada");
        }

        // Crear y guardar el Cliente (que extiende Persona)
        Cliente cliente = new Cliente();
        cliente.setCedula(dto.getCedula());
        cliente.setNombre(dto.getNombre());
        cliente.setApellido(dto.getApellido());
        cliente.setEmail(dto.getEmail());
        cliente.setTelefono(dto.getTelefono());
        cliente.setFechaNacimiento(dto.getFechaNacimiento());
        cliente.setPais(dto.getPais());
        cliente.setFechaPrimContacto(LocalDate.now()); // Se genera aquí, no viene del DTO
        clienteDao.save(cliente);

        // Crear y guardar el Usuario vinculado al Cliente
        Usuario usuario = new Usuario();
        usuario.setUsername(dto.getUsername());
        usuario.setPassword(passwordEncoder.encode(dto.getPassword())); // Contraseña hasheada con BCrypt
        usuario.setRol(Rol.CLIENTE);
        usuario.setCreatedAt(LocalDate.now());
        usuario.setCliente(cliente); // Vincula la cuenta al cliente recién creado
        usuarioDao.save(usuario);
    }
}
