package com.example.demo.Modelos.DAO;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.Modelos.Entity.Cliente;

public interface IClienteDao extends JpaRepository<Cliente, Long> {
    Optional<Cliente> findByCedula(long cedula);
}