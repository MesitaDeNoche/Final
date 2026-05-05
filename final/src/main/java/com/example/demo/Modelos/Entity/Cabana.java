package com.example.demo.Modelos.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

@Entity
@Table(name = "cabanas")
public class Cabana {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @NotBlank(message = "La zona no puede estar vacía")
    @Column(name = "zona", nullable = false, length = 100)
    private String zona;

    @NotBlank(message = "La categoría no puede estar vacía")
    @Column(name = "categoria", nullable = false, length = 100)
    private String categoria;

    @Min(value = 1, message = "La capacidad debe ser al menos 1 persona")
    @Column(name = "capacidad", nullable = false)
    private Integer cantidadPersonas;

    /**
     * Relación ManyToMany con Entretenimiento.
     *
     * CAMBIO: Se quitó CascadeType.ALL porque significaba que al borrar una cabaña
     * se eliminarían también los entretenimientos (compartidos por otras cabañas).
     * Se usa PERSIST y MERGE para guardar/actualizar en cascada sin eliminar.
     */
    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(name = "cabana_entretenimientos", joinColumns = @JoinColumn(name = "cabana_id"), inverseJoinColumns = @JoinColumn(name = "entretenimiento_id"))
    private List<Entretenimiento> entretenimientos;

    /**
     * Relación ManyToMany con Empleado.
     * FetchType.LAZY: los empleados se cargan sólo cuando se accede a la lista.
     */
    @ManyToMany(fetch = FetchType.LAZY)
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

    // Getters y Setters
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
