package com.example.demo.Modelos.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * Entidad que representa a un cliente del sistema.
 * Extiende Persona usando herencia JOINED (tabla propia "clientes" + FK a
 * "personas").
 */
@Entity
@Table(name = "clientes")
@PrimaryKeyJoinColumn(name = "cedula") // FK que referencia personas.cedula
public class Cliente extends Persona {

    @Column(name = "fecha_prim_contacto")
    private LocalDate fechaPrimContacto;

    @Column(name = "pais", length = 100)
    private String pais;

    public Cliente() {
    }

    public Cliente(Long cedula, String nombre, String apellido, String email,
            String telefono, LocalDate fechaNacimiento,
            LocalDate fechaPrimContacto, String pais) {
        super(cedula, nombre, apellido, email, telefono, fechaNacimiento);
        this.fechaPrimContacto = fechaPrimContacto;
        this.pais = pais;
    }

    public LocalDate getFechaPrimContacto() {
        return fechaPrimContacto;
    }

    public void setFechaPrimContacto(LocalDate fechaPrimContacto) {
        this.fechaPrimContacto = fechaPrimContacto;
    }

    public String getPais() {
        return pais;
    }

    public void setPais(String pais) {
        this.pais = pais;
    }
}
