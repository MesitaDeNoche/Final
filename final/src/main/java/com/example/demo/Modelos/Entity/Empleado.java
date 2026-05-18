package com.example.demo.Modelos.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import java.math.BigDecimal;
import java.util.List;

/**
 * Entidad que representa a un empleado del sistema.
 * Extiende Persona usando herencia JOINED.
 *
 * CAMBIO: Se reemplazó @Min(0) (para enteros) por @DecimalMin("0.00") correcto
 * para BigDecimal.
 */
@Entity
@Table(name = "empleados")
@PrimaryKeyJoinColumn(name = "cedula")
public class Empleado extends Persona {

    @DecimalMin(value = "0.00", message = "El salario no puede ser negativo") // CAMBIO: correcto para BigDecimal
    @Column(name = "salario", nullable = false, precision = 12, scale = 2)
    private BigDecimal salario;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "idiomas", length = 200)
    private String idiomas;

    /**
     * Relación reflexiva: un empleado puede tener un coordinador (otro empleado).
     * FetchType.LAZY evita cargar toda la cadena de coordinadores innecesariamente.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coordinador_id")
    private Empleado coordinador;

    /**
     * Lista de empleados que este empleado coordina (lado inverso de la relación).
     * mappedBy evita crear una tabla intermedia extra.
     */
    @OneToMany(mappedBy = "coordinador", fetch = FetchType.LAZY)
    private List<Empleado> subordinados; // CAMBIO: renombrado de "empleados" a "subordinados" para mayor claridad

    public Empleado() {
    }

    // Getters y Setters
    public BigDecimal getSalario() {
        return salario;
    }

    public void setSalario(BigDecimal salario) {
        this.salario = salario;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getIdiomas() {
        return idiomas;
    }

    public void setIdiomas(String idiomas) {
        this.idiomas = idiomas;
    }

    public Empleado getCoordinador() {
        return coordinador;
    }

    public void setCoordinador(Empleado coordinador) {
        this.coordinador = coordinador;
    }

    public List<Empleado> getSubordinados() {
        return subordinados;
    }

    public void setSubordinados(List<Empleado> subordinados) {
        this.subordinados = subordinados;
    }
}
