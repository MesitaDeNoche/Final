package com.example.demo.Modelos.DAO;

import com.example.demo.Modelos.Entity.Contrata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IContrataDao extends JpaRepository<Contrata, Long> {

    // Buscar todas las contratas de un cliente específico
    List<Contrata> findByClienteCedula(Long cedulaCliente);
}
