package com.example.demo.Modelos.DAO.Usuario;

import java.util.List;
import com.example.demo.Modelos.Entity.Usuario;

public interface IUsuarioDao {
    public void save(Usuario usuario);

    public Usuario findOne(Long id);

    public List<Usuario> findAll();

    public void delete(Long id);

}
