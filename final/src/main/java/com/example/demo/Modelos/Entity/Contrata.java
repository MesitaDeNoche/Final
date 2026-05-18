package com.example.demo.Modelos.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

/**
 * Entidad agregada que representa la contratación de una cabaña por un cliente.
 *
 * CAMBIO: Se agregó la relación con Cliente (estaba completamente ausente).
 * CAMBIO: Se renombraron los campos usando camelCase estándar Java
 * (id_contrata → idContrata, num_personas → numPersonas, etc.)
 */
@Entity
@Table(name = "contratas")
public class Contrata {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id_contrata")
    private Long idContrata; // CAMBIO: camelCase

    @NotNull(message = "La cabaña es obligatoria")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_cabana", nullable = false)
    private Cabana cabana;

    /**
     * CAMBIO: Se agregó la relación con Cliente que faltaba por completo.
     * Sin esto, no se sabía qué cliente contrató la cabaña.
     */
    @NotNull(message = "El cliente es obligatorio")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cedula_cliente", nullable = false)
    private Cliente cliente;

    @Min(value = 1, message = "Debe haber al menos 1 persona")
    @Column(name = "num_personas", nullable = false)
    private Integer numPersonas; // CAMBIO: camelCase

    @NotNull(message = "La fecha de inicio es obligatoria")
    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio; // CAMBIO: camelCase

    @Min(value = 1, message = "La estancia debe ser de al menos 1 día")
    @Column(name = "cant_dias", nullable = false)
    private Integer cantDias; // CAMBIO: camelCase

    public Contrata() {
    }

    public Contrata(Long idContrata, Cabana cabana, Cliente cliente,
            Integer numPersonas, LocalDate fechaInicio, Integer cantDias) {
        this.idContrata = idContrata;
        this.cabana = cabana;
        this.cliente = cliente;
        this.numPersonas = numPersonas;
        this.fechaInicio = fechaInicio;
        this.cantDias = cantDias;
    }

    // Getters y Setters
    public Long getIdContrata() {
        return idContrata;
    }

    public void setIdContrata(Long idContrata) {
        this.idContrata = idContrata;
    }

    public Cabana getCabana() {
        return cabana;
    }

    public void setCabana(Cabana cabana) {
        this.cabana = cabana;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Integer getNumPersonas() {
        return numPersonas;
    }

    public void setNumPersonas(Integer numPersonas) {
        this.numPersonas = numPersonas;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public Integer getCantDias() {
        return cantDias;
    }

    public void setCantDias(Integer cantDias) {
        this.cantDias = cantDias;
    }
}
