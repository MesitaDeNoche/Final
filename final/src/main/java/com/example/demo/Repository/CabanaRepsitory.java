package com.example.demo.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.Modelos.Entity.Cabana;

@Repository
public interface CabanaRepsitory extends JpaRepository<Cabana, Long> {

    // El ignoreCase permite buscar sin importar mayúsculas o minúsculas
    List<Cabana> findByZonaIgnoreCase(String zona);

    List<Cabana> findByCategoriaIgnoreCase(String categoria);

    // El greaterThanEqual permite buscar cabañas con capacidad igual o mayor a la
    /*
     * Por ejemplo si se le pone una busqueda de 4 personas, spring va a buscar las
     * cabañas
     * con capacidad de 4,5,6, etc
     */
    List<Cabana> findByCantidadPersonasGreaterThanEqual(Integer cantidadPersonas);
}
