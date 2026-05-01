package com.example.demo.Modelos.Entity;

import java.time.LocalDate;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

// Esta es una entidad agregada, donde una persona contrata una cabaña con atributos propios de la relacion

@Entity
@Table(name = "contratas")
public class Contrata {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name = "id_contrata")
    private Long id_contrata;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_cabana", nullable = false)
    private Cabana cabana;

    // Atributos propios de la relación

    @Min(1)
    @Column(name = "num_personas", nullable = false)
    private Integer num_personas;

    @NotNull
    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fecha_inicio;

    @Min(1)
    @Column(name = "cant_dias", nullable = false)
    private Integer cant_dias;

    public Contrata() {
    }

    public Contrata(Long id_contrata, Cabana cabana, Integer num_personas, LocalDate fecha_inicio, Integer cant_dias) {
        this.id_contrata = id_contrata;
        this.cabana = cabana;
        this.num_personas = num_personas;
        this.fecha_inicio = fecha_inicio;
        this.cant_dias = cant_dias;
    }

    public Long getId_contrata() {
        return id_contrata;
    }

    public void setId_contrata(Long id_contrata) {
        this.id_contrata = id_contrata;
    }

    public Cabana getCabana() {
        return cabana;
    }

    public void setCabana(Cabana cabana) {
        this.cabana = cabana;
    }

    public Integer getNum_personas() {
        return num_personas;
    }

    public void setNum_personas(Integer num_personas) {
        this.num_personas = num_personas;
    }

    public LocalDate getFecha_inicio() {
        return fecha_inicio;
    }

    public void setFecha_inicio(LocalDate fecha_inicio) {
        this.fecha_inicio = fecha_inicio;
    }

    public Integer getCant_dias() {
        return cant_dias;
    }

    public void setCant_dias(Integer cant_dias) {
        this.cant_dias = cant_dias;
    }
}