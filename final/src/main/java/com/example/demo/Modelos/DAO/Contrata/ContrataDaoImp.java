package com.example.demo.Modelos.DAO.Contrata;

import java.util.List;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.Modelos.Entity.Contrata;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Repository
public class ContrataDaoImp implements IContrataDao {

    @PersistenceContext
    private EntityManager em;

    @Override
    @Transactional(readOnly = false)
    public void save(Contrata contrato) {
        if (contrato.getId_contrata() != null && contrato.getId_contrata() > 0) {
            em.merge(contrato);
        } else {
            em.persist(contrato);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Contrata findOne(Long id) {
        return em.find(Contrata.class, id);
    }

    @Override
    @Transactional(readOnly = true)
    @SuppressWarnings("unchecked")
    public List<Contrata> findAll() {
        return em.createQuery("from Contrata").getResultList();
    }

    @Override
    @Transactional(readOnly = false)
    public void delete(Long id) {
        Contrata contrato = findOne(id);
        if (contrato != null) {
            em.remove(contrato);
        }
    }

}
