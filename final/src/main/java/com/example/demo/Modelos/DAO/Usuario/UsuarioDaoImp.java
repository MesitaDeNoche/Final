package com.example.demo.Modelos.DAO.Usuario;

import java.util.List;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.Modelos.Entity.Usuario;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Repository
public class UsuarioDaoImp implements IUsuarioDao {

    @PersistenceContext
    private EntityManager em;

    @Override
    @Transactional(readOnly = false)
    public void save(Usuario usuario) {
        if (usuario.getId() != null) {
            em.merge(usuario);
        } else {
            em.persist(usuario);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Usuario findOne(Long id) {
        return em.find(Usuario.class, id);
    }

    @Override
    @Transactional(readOnly = true)
    @SuppressWarnings("unchecked")
    public List<Usuario> findAll() {
        return em.createQuery("from Usuario").getResultList();
    }

    @Override
    @Transactional(readOnly = false)
    public void delete(Long id) {
        Usuario usuario = findOne(id);
        if (usuario != null) {
            em.remove(usuario);
        }
    }

}
