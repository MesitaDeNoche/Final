package com.example.demo.Modelos.DAO.Empleado;

import java.util.List;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.Modelos.Entity.Empleado;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Repository
public class EmpleadoDaoImp implements IEmpleadoDao {

    @PersistenceContext
    private EntityManager em;

    @Override
    @Transactional(readOnly = false)
    public void save(Empleado empleado) {
        if (empleado.getCedula() != null) {
            em.merge(empleado);
        } else {
            em.persist(empleado);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Empleado findOne(Long id) {
        return em.find(Empleado.class, id);
    }

    @Override
    @Transactional(readOnly = true)
    @SuppressWarnings("unchecked")
    public List<Empleado> findAll() {
        return em.createQuery("from Empleado").getResultList();
    }

    @Override
    @Transactional(readOnly = false)
    public void delete(Long id) {
        Empleado empleado = findOne(id);
        if (empleado != null) {
            em.remove(empleado);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Empleado findBynombre(String nombre) {
        return (Empleado) em.createQuery("from Empleado e where e.nombre like :nombre")
                .setParameter("nombre", nombre)
                .getResultList()
                .get(0);
    }

}
