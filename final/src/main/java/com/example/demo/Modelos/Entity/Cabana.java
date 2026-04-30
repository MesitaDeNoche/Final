package com.example.demo.Modelos.Entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

@Entity
@Table(name = "cabanas")
public class Cabana {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @NotBlank
    @Column(name = "zona", nullable = false, length = 100)
    private String zona;

    @NotBlank
    @Column(name = "categoria", nullable = false, length = 100)
    private String categoria;

    @Min(1)
    @Column(name = "capacidad", nullable = false)
    private Integer cantidadPersonas;

    // Relacion que define que las cabañas tienen entretenimientos
    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "cabana_entretenimientos", joinColumns = @JoinColumn(name = "cabana_id"), inverseJoinColumns = @JoinColumn(name = "entretenimiento_id"))
    private List<Entretenimiento> entretenimientos;

    // Relacion que define que las cabañas tienen empleados trabajando en ellas
    @ManyToMany(fetch = FetchType.LAZY) // Carga los empleados cuando se necesitan (carga perezosa)
    @JoinTable(name = "cabana_empleados", joinColumns = @JoinColumn(name = "cabana_id"), inverseJoinColumns = @JoinColumn(name = "empleado_id"))
    private List<Empleado> empleados;

    public Cabana() {
    }

    public Cabana(Long id, String zona, String categoria, Integer cantidadPersonas) {
        this.id = id;
        this.zona = zona;
        this.categoria = categoria;
        this.cantidadPersonas = cantidadPersonas;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getZona() {
        return zona;
    }

    public void setZona(String zona) {
        this.zona = zona;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public Integer getCantidadPersonas() {
        return cantidadPersonas;
    }

    public void setCantidadPersonas(Integer cantidadPersonas) {
        this.cantidadPersonas = cantidadPersonas;
    }

    public List<Entretenimiento> getEntretenimientos() {
        return entretenimientos;
    }

    public void setEntretenimientos(List<Entretenimiento> entretenimientos) {
        this.entretenimientos = entretenimientos;
    }

    public List<Empleado> getEmpleados() {
        return empleados;
    }

    public void setEmpleados(List<Empleado> empleados) {
        this.empleados = empleados;
    }
}