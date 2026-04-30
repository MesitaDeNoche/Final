package com.example.demo.Modelos.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.LocalDate;
import jakarta.persistence.Column;
import jakarta.persistence.PrimaryKeyJoinColumn;

@Entity
@Table(name = "clientes")
@PrimaryKeyJoinColumn(name = "cedula")
public class Cliente extends Persona {

    @Column(name = "fecha_prim_contacto")
    private LocalDate fechaPrimContacto;

    @Column(name = "pais")
    private String pais;

    public Cliente(Long cedula, String nombre, String apellido, String email, String telefono,
            LocalDate fechaNacimiento) {
        super(cedula, nombre, apellido, email, telefono, fechaNacimiento);
    }

    public Cliente() {
    }

    public Cliente(LocalDate fechaPrimContacto, String pais) {
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