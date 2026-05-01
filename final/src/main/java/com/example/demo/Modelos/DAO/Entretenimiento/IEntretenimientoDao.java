package com.example.demo.Modelos.DAO.Entretenimiento;

import java.util.List;
import com.example.demo.Modelos.Entity.Entretenimiento;

public interface IEntretenimientoDao {
    public void save(Entretenimiento entretenimiento);

    public Entretenimiento findOne(Long id);

    public List<Entretenimiento> findAll();

    public void delete(Long id);
}
