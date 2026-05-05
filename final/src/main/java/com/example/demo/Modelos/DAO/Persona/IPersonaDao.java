package com.example.demo.Modelos.DAO.Persona;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.Modelos.Entity.Persona;
public interface IPersonaDao extends JpaRepository<Persona, Long> {

}
