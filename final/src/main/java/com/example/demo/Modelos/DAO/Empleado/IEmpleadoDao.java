package com.example.demo.Modelos.DAO.Empleado;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.Modelos.Entity.Empleado;
public interface IEmpleadoDao extends JpaRepository<Empleado, Long> {
    Optional<Empleado> findByCedula(long cedula);
}
