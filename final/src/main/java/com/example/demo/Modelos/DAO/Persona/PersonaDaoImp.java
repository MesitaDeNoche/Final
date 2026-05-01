package com.example.demo.Modelos.DAO.Persona;

import java.util.List;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.Modelos.Entity.Persona;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Repository
public class PersonaDaoImp implements IPersonaDao {

    @PersistenceContext
    private EntityManager em;

    @Override
    @Transactional(readOnly = false)
    public void save(Persona persona) {
        if (persona.getCedula() != null) {
            em.merge(persona);
        } else {
            em.persist(persona);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Persona findOne(Long id) {
        return em.find(Persona.class, id);
    }

    @Override
    @Transactional(readOnly = true)
    @SuppressWarnings("unchecked")
    public List<Persona> findAll() {
        return em.createQuery("from Persona").getResultList();
    }

    @Override
    @Transactional(readOnly = false)
    public void delete(Long id) {
        Persona persona = findOne(id);
        if (persona != null) {
            em.remove(persona);
        }
    }

}
