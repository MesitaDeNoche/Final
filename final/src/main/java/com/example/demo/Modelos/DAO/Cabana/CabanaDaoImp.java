package com.example.demo.Modelos.DAO.Cabana;

import java.util.List;
import org.springframework.stereotype.Repository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import com.example.demo.Modelos.Entity.Cabana;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class CabanaDaoImp implements ICabanaDao {
    @PersistenceContext
    private EntityManager em;

    // consulta para traer todas las cabanas
    @Override
    @Transactional(readOnly = true)
    @SuppressWarnings("unchecked")
    public List<Cabana> findAll() {
        return em.createQuery("from Cabana").getResultList();
    }

    // consulta para guardar una cabana
    @Override
    @Transactional(readOnly = false)
    public void save(Cabana cabana) {
        if (cabana.getId() != null && cabana.getId() > 0) {
            em.merge(cabana); // update
        } else {
            em.persist(cabana); // create
        }
    }

    // consulta para traer una cabana por id
    @Override
    @Transactional(readOnly = true)
    public Cabana findOne(Long id) {
        return em.find(Cabana.class, id);
    }

    // consulta para eliminar una cabana
    @Override
    @Transactional(readOnly = false)
    public void delete(Long id) {
        Cabana cabana = findOne(id);
        if (cabana != null) {
            em.remove(cabana);
        }
    }
}
