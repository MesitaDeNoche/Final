package com.example.demo.Modelos.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Entidad que representa la cuenta de usuario del sistema.
 *
 * CAMBIO: Se agregó la relación con Cliente (setCliente() que usaba
 * RegistroService pero no existía).
 * CAMBIO: Se agregó @Column(updatable = false) en createdAt para que la fecha
 * no se modifique.
 */
@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", columnDefinition = "UUID")
    private UUID id;

    @Column(name = "username", nullable = false, unique = true, length = 50)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @Enumerated(EnumType.STRING) // Almacena el enum como texto ("ADMIN", "CLIENTE")
    @Column(name = "rol", nullable = false, length = 20)
    private Rol rol = Rol.CLIENTE;

    /**
     * CAMBIO: Se agregó relación con Cliente.
     * RegistroService llamaba a usuario.setCliente(cliente) pero el campo no
     * existía.
     */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cedula_cliente", referencedColumnName = "cedula")
    private Cliente cliente;

    /**
     * Relación con Empleado (para usuarios tipo ADMIN que son empleados).
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cedula_empleado", referencedColumnName = "cedula")
    private Empleado empleado;

    @Column(name = "created_at", nullable = false, updatable = false) // CAMBIO: updatable = false
    private LocalDate createdAt;

    public enum Rol {
        ADMIN, CLIENTE
    }

    public Usuario() {
    }

    public Usuario(UUID id, String username, String password, Rol rol,
            Cliente cliente, Empleado empleado, LocalDate createdAt) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.rol = rol;
        this.cliente = cliente;
        this.empleado = empleado;
        this.createdAt = createdAt;
    }

    // Getters y Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Empleado getEmpleado() {
        return empleado;
    }

    public void setEmpleado(Empleado empleado) {
        this.empleado = empleado;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }
}
