package com.example.demo.Modelos.DAO.Empleado;

import java.util.List;
import com.example.demo.Modelos.Entity.Empleado;

public interface IEmpleadoDao {
    public void save(Empleado empleado);

    public Empleado findOne(Long id);

    public List<Empleado> findAll();

    public void delete(Long id);

    public Empleado findBynombre(String nombre);
}
