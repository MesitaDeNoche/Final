package com.example.demo.Modelos.DAO.Cabana;

import java.util.List;
import com.example.demo.Modelos.Entity.Cabana;

public interface ICabanaDao {
    public void save(Cabana cabana);

    public Cabana findOne(Long id);

    public List<Cabana> findAll();

    public void delete(Long id);

}
