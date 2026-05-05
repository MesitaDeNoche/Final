package com.example.demo.Modelos.DAO;

import com.example.demo.Modelos.Entity.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IEmpleadoDao extends JpaRepository<Empleado, Long> {
}
