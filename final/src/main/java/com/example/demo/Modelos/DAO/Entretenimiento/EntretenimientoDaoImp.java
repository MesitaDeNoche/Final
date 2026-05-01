package com.example.demo.Modelos.DAO.Entretenimiento;

import java.util.List;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.Modelos.Entity.Entretenimiento;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Repository
public class EntretenimientoDaoImp implements IEntretenimientoDao {

    @PersistenceContext
    private EntityManager em;

    @Override
    @Transactional(readOnly = false)
    public void save(Entretenimiento entretenimiento) {
        if (entretenimiento.getId() != null && entretenimiento.getId() > 0) {
            em.merge(entretenimiento);
        } else {
            em.persist(entretenimiento);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Entretenimiento findOne(Long id) {
        return em.find(Entretenimiento.class, id);
    }

    @Override
    @Transactional(readOnly = true)
    @SuppressWarnings("unchecked")
    public List<Entretenimiento> findAll() {
        return em.createQuery("from Entretenimiento").getResultList();
    }

    @Override
    @Transactional(readOnly = false)
    public void delete(Long id) {
        Entretenimiento entretenimiento = findOne(id);
        if (entretenimiento != null) {
            em.remove(entretenimiento);
        }
    }

}
