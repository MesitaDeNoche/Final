package com.example.demo.Modelos.DAO;

import com.example.demo.Modelos.Entity.Entretenimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IEntretenimientoDao extends JpaRepository<Entretenimiento, Long> {}
