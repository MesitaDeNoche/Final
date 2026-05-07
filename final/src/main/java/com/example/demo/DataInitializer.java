package com.example.demo;

import com.example.demo.Modelos.DAO.ICabanaDao;
import com.example.demo.Modelos.DAO.IEntretenimientoDao;
import com.example.demo.Modelos.Entity.Cabana;
import com.example.demo.Modelos.Entity.Entretenimiento;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

/**
 * Inicializa datos de prueba al arrancar la aplicación.
 * Solo inserta si las tablas están vacías.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private ICabanaDao          cabanaDao;
    @Autowired private IEntretenimientoDao entretenimientoDao;

    @Override
    public void run(String... args) throws Exception {

        // ── 1. Entretenimientos ──────────────────────────────────────────────
        if (entretenimientoDao.count() == 0) {
            List<String> nombres = Arrays.asList(
                "Piscina",
                "Jacuzzi privado",
                "Fogón / Chimenea",
                "Parrilla BBQ",
                "Sendero ecológico",
                "Acceso al río",
                "Canotaje",
                "Pesca deportiva",
                "Vista panorámica 360°",
                "Zona de spa",
                "Juegos de mesa",
                "Hamacas",
                "Cancha de fútbol",
                "Observación de aves",
                "Desayuno incluido"
            );
            nombres.forEach(n -> {
                Entretenimiento e = new Entretenimiento();
                e.setNombre(n);
                entretenimientoDao.save(e);
            });
            System.out.println("✔ Entretenimientos creados: " + nombres.size());
        }

        // ── 2. Cabañas ───────────────────────────────────────────────────────
        if (cabanaDao.count() == 0) {

            // Recuperar entretenimientos ya guardados para asociarlos
            List<Entretenimiento> ents = entretenimientoDao.findAll();

            // Helper para buscar por nombre
            java.util.function.Function<String, Entretenimiento> ent = nombre ->
                ents.stream().filter(e -> e.getNombre().equals(nombre)).findFirst().orElse(null);

            // ── Cabaña 1: Suite del Mirador ──────────────────────────────────
            Cabana c1 = new Cabana();
            c1.setZona("Zona Mirador");
            c1.setCategoria("Suite");
            c1.setCantidadPersonas(2);
            c1.setPrecioNoche(520.0);
            c1.setDescripcion("La experiencia más exclusiva de Mar Azul. Disfruta de una vista panorámica de 360° desde tu cama. Perfecta para parejas que buscan lujo y privacidad en plena naturaleza.");
            c1.setFotoUrl("https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=85");
            c1.setEntretenimientos(List.of(
                ent.apply("Vista panorámica 360°"),
                ent.apply("Jacuzzi privado"),
                ent.apply("Zona de spa"),
                ent.apply("Desayuno incluido"),
                ent.apply("Hamacas")
            ).stream().filter(e -> e != null).toList());
            cabanaDao.save(c1);

            // ── Cabaña 2: Refugio del Bosque ─────────────────────────────────
            Cabana c2 = new Cabana();
            c2.setZona("Zona Bosque");
            c2.setCategoria("Estándar");
            c2.setCantidadPersonas(4);
            c2.setPrecioNoche(180.0);
            c2.setDescripcion("Rodeada de árboles centenarios, esta cabaña te invita a desconectarte del mundo. Ideal para familias pequeñas o grupos de amigos que aman el contacto con la naturaleza.");
            c2.setFotoUrl("https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800&q=85");
            c2.setEntretenimientos(List.of(
                ent.apply("Sendero ecológico"),
                ent.apply("Fogón / Chimenea"),
                ent.apply("Parrilla BBQ"),
                ent.apply("Observación de aves"),
                ent.apply("Hamacas"),
                ent.apply("Juegos de mesa")
            ).stream().filter(e -> e != null).toList());
            cabanaDao.save(c2);

            // ── Cabaña 3: Villa del Río ──────────────────────────────────────
            Cabana c3 = new Cabana();
            c3.setZona("Zona Río");
            c3.setCategoria("Premium");
            c3.setCantidadPersonas(8);
            c3.setPrecioNoche(450.0);
            c3.setDescripcion("Amplia villa frente al río, ideal para grupos grandes. El sonido del agua te acompaña durante toda tu estadía. Incluye acceso directo al río y equipos de canotaje.");
            c3.setFotoUrl("https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=85");
            c3.setEntretenimientos(List.of(
                ent.apply("Acceso al río"),
                ent.apply("Canotaje"),
                ent.apply("Pesca deportiva"),
                ent.apply("Parrilla BBQ"),
                ent.apply("Piscina"),
                ent.apply("Cancha de fútbol"),
                ent.apply("Fogón / Chimenea")
            ).stream().filter(e -> e != null).toList());
            cabanaDao.save(c3);

            // ── Cabaña 4: Nido de las Alturas ───────────────────────────────
            Cabana c4 = new Cabana();
            c4.setZona("Zona Alta");
            c4.setCategoria("Premium");
            c4.setCantidadPersonas(6);
            c4.setPrecioNoche(320.0);
            c4.setDescripcion("Ubicada en el punto más alto del complejo, con vistas impresionantes al lago y a las montañas. Perfecta para grupos que quieren comodidad premium con un toque de aventura.");
            c4.setFotoUrl("https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=85");
            c4.setEntretenimientos(List.of(
                ent.apply("Vista panorámica 360°"),
                ent.apply("Jacuzzi privado"),
                ent.apply("Fogón / Chimenea"),
                ent.apply("Sendero ecológico"),
                ent.apply("Observación de aves"),
                ent.apply("Parrilla BBQ")
            ).stream().filter(e -> e != null).toList());
            cabanaDao.save(c4);

            // ── Cabaña 5: Cabaña del Lago ────────────────────────────────────
            Cabana c5 = new Cabana();
            c5.setZona("Zona Lago");
            c5.setCategoria("Estándar");
            c5.setCantidadPersonas(3);
            c5.setPrecioNoche(150.0);
            c5.setDescripcion("Acogedora cabaña para parejas o pequeños grupos, con terraza directa al lago. Una opción tranquila y económica sin renunciar a la belleza natural de Mar Azul.");
            c5.setFotoUrl("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85");
            c5.setEntretenimientos(List.of(
                ent.apply("Pesca deportiva"),
                ent.apply("Hamacas"),
                ent.apply("Juegos de mesa"),
                ent.apply("Fogón / Chimenea")
            ).stream().filter(e -> e != null).toList());
            cabanaDao.save(c5);

            // ── Cabaña 6: La Casona Colonial ─────────────────────────────────
            Cabana c6 = new Cabana();
            c6.setZona("Zona Colonial");
            c6.setCategoria("Suite");
            c6.setCantidadPersonas(4);
            c6.setPrecioNoche(680.0);
            c6.setDescripcion("Una joya arquitectónica restaurada con acabados coloniales y comodidades de lujo moderno. La cabaña más especial del complejo, con servicio personalizado y desayuno gourmet.");
            c6.setFotoUrl("https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=85");
            c6.setEntretenimientos(List.of(
                ent.apply("Desayuno incluido"),
                ent.apply("Zona de spa"),
                ent.apply("Jacuzzi privado"),
                ent.apply("Vista panorámica 360°"),
                ent.apply("Hamacas"),
                ent.apply("Piscina")
            ).stream().filter(e -> e != null).toList());
            cabanaDao.save(c6);

            // ── Cabaña 7: Refugio Aventurero ─────────────────────────────────
            Cabana c7 = new Cabana();
            c7.setZona("Zona Montaña");
            c7.setCategoria("Estándar");
            c7.setCantidadPersonas(5);
            c7.setPrecioNoche(210.0);
            c7.setDescripcion("Diseñada para los amantes de la aventura. Punto de partida ideal para rutas de senderismo, escalada y observación de fauna silvestre. Rústica pero cómoda.");
            c7.setFotoUrl("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=85");
            c7.setEntretenimientos(List.of(
                ent.apply("Sendero ecológico"),
                ent.apply("Observación de aves"),
                ent.apply("Parrilla BBQ"),
                ent.apply("Fogón / Chimenea"),
                ent.apply("Cancha de fútbol")
            ).stream().filter(e -> e != null).toList());
            cabanaDao.save(c7);

            // ── Cabaña 8: Pabellón del Jardín ────────────────────────────────
            Cabana c8 = new Cabana();
            c8.setZona("Zona Jardín");
            c8.setCategoria("Premium");
            c8.setCantidadPersonas(6);
            c8.setPrecioNoche(390.0);
            c8.setDescripcion("Rodeada de jardines tropicales con flores nativas. Su piscina privada y zona BBQ la convierten en la opción perfecta para familias que quieren relajarse sin alejarse del lujo.");
            c8.setFotoUrl("https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=85");
            c8.setEntretenimientos(List.of(
                ent.apply("Piscina"),
                ent.apply("Parrilla BBQ"),
                ent.apply("Hamacas"),
                ent.apply("Juegos de mesa"),
                ent.apply("Sendero ecológico"),
                ent.apply("Observación de aves")
            ).stream().filter(e -> e != null).toList());
            cabanaDao.save(c8);

            System.out.println("✔ Cabañas creadas: 8");
        } else {
            System.out.println("ℹ Cabañas ya existentes, no se insertan datos de prueba.");
        }
    }
}
