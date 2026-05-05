package com.example.demo.Modelos.DAO;

import com.example.demo.Modelos.Entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface IClienteDao extends JpaRepository<Cliente, Long> {

    Optional<Cliente> findByEmail(String email);
}
