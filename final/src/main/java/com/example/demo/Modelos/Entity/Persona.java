package com.example.demo.Modelos.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

/**
 * Entidad base para todas las personas del sistema.
 *
 * CAMBIO: Se agregó @Inheritance(strategy = JOINED) para que Cliente y Empleado
 * compartan la tabla "personas" y tengan sus propias tablas con clave foránea.
 * Sin esta anotación, Hibernate no sabe cómo mapear la herencia.
 */
@Entity
@Table(name = "personas")
@Inheritance(strategy = InheritanceType.JOINED) // ← NECESARIO para herencia con Cliente y Empleado
public class Persona {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long cedula;

    @NotBlank(message = "El nombre no puede estar vacío")
    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @NotBlank(message = "El apellido no puede estar vacío")
    @Column(name = "apellido", nullable = false, length = 100)
    private String apellido;

    @Email(message = "Formato de email inválido")
    @Column(name = "email", nullable = false, unique = true, length = 100) // CAMBIO: email único
    private String email;

    @Column(name = "telefono", nullable = false, length = 20) // CAMBIO: length reducido a 20 (más realista)
    private String telefono;

    @Column(name = "fecha_nacimiento", nullable = false)
    private LocalDate fechaNacimiento;

    public Persona() {
    }

    public Persona(Long cedula, String nombre, String apellido, String email,
            String telefono, LocalDate fechaNacimiento) {
        this.cedula = cedula;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.telefono = telefono;
        this.fechaNacimiento = fechaNacimiento;
    }

    // Getters y Setters
    public Long getCedula() {
        return cedula;
    }

    public void setCedula(Long cedula) {
        this.cedula = cedula;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }
}
