package com.example.demo.Modelos.DAO.Contrata;

import java.util.List;
import com.example.demo.Modelos.Entity.Contrata;

public interface IContrataDao {
    public void save(Contrata contrato);

    public Contrata findOne(Long id);

    public List<Contrata> findAll();

    public void delete(Long id);
}
