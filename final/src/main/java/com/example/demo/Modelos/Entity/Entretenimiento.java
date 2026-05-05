package com.example.demo.Modelos.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "entretenimientos")
public class Entretenimiento {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @NotBlank(message = "El nombre del entretenimiento no puede estar vacío")
    @Column(name = "nombre", nullable = false, length = 100, unique = true)
    private String nombre;

    public Entretenimiento() {
    }

    public Entretenimiento(Long id, String nombre) {
        this.id = id;
        this.nombre = nombre;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
