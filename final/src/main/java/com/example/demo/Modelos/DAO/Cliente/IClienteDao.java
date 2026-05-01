package com.example.demo.Modelos.DAO.Cliente;

import java.util.List;
import com.example.demo.Modelos.Entity.Cliente;

public interface IClienteDao {
    public void save(Cliente cliente);

    public Cliente findOne(Long id);

    public List<Cliente> findAll();

    public void delete(Long id);

    public Cliente findByNombre(String nombre);
}
