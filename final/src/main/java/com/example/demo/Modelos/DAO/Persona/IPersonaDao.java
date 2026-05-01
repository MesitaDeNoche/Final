package com.example.demo.Modelos.DAO.Persona;

import java.util.List;
import com.example.demo.Modelos.Entity.Persona;

public interface IPersonaDao {
    public void save(Persona persona);

    public Persona findOne(Long id);

    public List<Persona> findAll();

    public void delete(Long id);

}
