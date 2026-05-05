package com.example.demo.Modelos.DAO;

import com.example.demo.Modelos.Entity.Cabana;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repositorio para Cabana.
 *
 * CAMBIO: Se reemplazaron los métodos manuales findOne(id) y delete(id)
 * del CabanaController (que son de JpaRepository antiguo y no existen en Spring
 * Data 3.x)
 * por findById() y deleteById() que sí existen.
 *
 * Los métodos findByZonaIgnoreCase y findByCategoriaIgnoreCase son generados
 * automáticamente por Spring Data a partir del nombre del método.
 */
@Repository
public interface ICabanaDao extends JpaRepository<Cabana, Long> {

    List<Cabana> findByZonaIgnoreCase(String zona);

    List<Cabana> findByCategoriaIgnoreCase(String categoria);

    // findById ya existe en JpaRepository → devuelve Optional<Cabana>
    // deleteById ya existe en JpaRepository
}
