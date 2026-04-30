package com.example.demo.Modelos.Entity;

import java.math.BigDecimal;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import java.util.List;
import jakarta.persistence.PrimaryKeyJoinColumn;

@Entity
@Table(name = "empleados")
@PrimaryKeyJoinColumn(name = "cedula")
public class Empleado extends Persona {

    @Min(0)
    @Column(name = "salario", nullable = false, precision = 12, scale = 2)
    /*
     * El precision define la cantidad total de digitos, y el scale define la
     * cantidad de digitos despues del punto decimal
     * El scale puede ser un valor negativo, que define la cantidad de digitos a la
     * izquierda del punto decimal
     */
    private BigDecimal salario;
    // El BigDecimal es especial para manejar valores monetarios

    @Column(name = "descripcion", columnDefinition = "TEXT")
    /*
     * TEXT es un tipo de dato de columna que permite almacenar texto de longitud
     * variable sin limite de caracteres
     */
    private String descripcion;

    @Column(name = "idiomas")
    private String idiomas;

    // Relación Es_Cord: un empleado puede ser coordinado por otro empleado
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coordinador_id")
    private Empleado coordinador;

    // Empleados que coordinan
    @OneToMany(mappedBy = "coordinador", fetch = FetchType.LAZY)
    /*
     * mappedBy define que la relacion es bidireccional, que la lista se define en
     * la
     * clase Empleado sin necesidad de crear una tabla adicional intermedia.
     */
    private List<Empleado> empleados;

    public Empleado() {
    }

    public Empleado(BigDecimal salario, String descripcion, String idiomas, Empleado coordinador,
            List<Empleado> empleados) {
        this.salario = salario;
        this.descripcion = descripcion;
        this.idiomas = idiomas;
        this.coordinador = coordinador;
        this.empleados = empleados;
    }

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

    public List<Empleado> getEmpleados() {
        return empleados;
    }

    public void setEmpleados(List<Empleado> empleados) {
        this.empleados = empleados;
    }

}
