package com.example.demo.Modelos.DAO.Cliente;

import java.util.List;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.Modelos.Entity.Cliente;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Repository
public class ClienteDaoImp implements IClienteDao {

    @PersistenceContext
    private EntityManager em;

    @Override
    @Transactional(readOnly = false)
    public void save(Cliente cliente) {
        if (cliente.getCedula() != null) {
            em.merge(cliente);
        } else {
            em.persist(cliente);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Cliente findOne(Long id) {
        return em.find(Cliente.class, id);
    }

    @Override
    @Transactional(readOnly = true)
    @SuppressWarnings("unchecked")
    public List<Cliente> findAll() {
        return em.createQuery("from Cliente").getResultList();
    }

    @Override
    @Transactional(readOnly = false)
    public void delete(Long id) {
        Cliente cliente = findOne(id);
        if (cliente != null) {
            em.remove(cliente);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Cliente findByNombre(String nombre) {
        return (Cliente) em.createQuery("from Cliente c where c.nombre like :nombre")
                .setParameter("nombre", nombre)
                .getResultList()
                .get(0);
    }

}
