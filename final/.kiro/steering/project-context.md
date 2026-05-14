# Contexto del Proyecto: Mar Azul — Sistema de Gestión de Cabañas

## Descripción General
Aplicación web full-stack para gestión de reservas de cabañas turísticas llamada **Mar Azul**.
Permite a clientes explorar y reservar cabañas, y a administradores gestionar el inventario.

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Backend | Spring Boot 3.5.14 (Java 17) |
| Frontend | React 19 + Vite 8 |
| Base de datos | PostgreSQL en Supabase (cloud) |
| Seguridad | Spring Security (sin JWT, sesión manual) |
| ORM | Spring Data JPA / Hibernate |
| Build backend | Maven (mvnw) |
| Build frontend | npm / Vite |

---

## Puertos

- **Backend**: `http://localhost:8070`
- **Frontend**: `http://localhost:5173`
- El frontend usa proxy Vite: `/api/*` → `http://localhost:8070`

---

## Estructura del Proyecto

```
final/
├── src/main/java/com/example/demo/
│   ├── ConfiguracionSecurity/
│   │   ├── WebSecurityConfig.java   # Spring Security (CSRF off, CORS, BCrypt)
│   │   └── MvcConfig.java           # CORS global + view controllers
│   ├── Controllers/
│   │   ├── AuthController.java      # POST /api/auth/login, /api/auth/registro
│   │   ├── CabanaController.java    # CRUD /api/cabana
│   │   ├── ClienteController.java   # GET /api/cliente (solo ADMIN)
│   │   ├── ContrataController.java  # CRUD /api/contrata + stats
│   │   ├── EmpleadoController.java
│   │   ├── EntretenimientoController.java
│   │   └── PersonaController.java
│   ├── DTO/
│   │   ├── LoginDTO.java            # {username, password}
│   │   └── RegistroDTO.java         # Datos de registro con validaciones @Valid
│   ├── Modelos/
│   │   ├── DAO/                     # Interfaces JPA Repository
│   │   └── Entity/
│   │       ├── Persona.java         # Entidad base (herencia JOINED)
│   │       ├── Cliente.java         # Extiende Persona → tabla "clientes"
│   │       ├── Empleado.java        # Extiende Persona → tabla "empleados"
│   │       ├── Usuario.java         # Cuenta de usuario (UUID id, rol ADMIN/CLIENTE)
│   │       ├── Cabana.java          # Cabaña (zona, categoria, precio, foto, entretenimientos)
│   │       ├── Contrata.java        # Reserva (cabana + cliente + fechas)
│   │       └── Entretenimiento.java # Actividades asociadas a cabañas
│   └── Services/
│       ├── UsuarioService.java      # UserDetailsService para Spring Security
│       └── RegistroService.java     # Lógica de registro (crea Cliente + Usuario)
├── frontend/
│   ├── src/
│   │   ├── App.jsx                  # SPA completa (login, registro, dashboard, catálogo)
│   │   └── main.jsx
│   └── vite.config.js               # Proxy /api → localhost:8070
└── src/main/resources/
    └── application.properties       # Config DB, puerto 8070
```

---

## Modelo de Dominio

### Herencia JPA (JOINED)
```
Persona (tabla: personas)
├── Cliente (tabla: clientes) — FK: cedula
└── Empleado (tabla: empleados) — FK: cedula
```

### Entidades principales
- **Persona**: cedula (PK, Long), nombre, apellido, email, telefono, fechaNacimiento
- **Cliente**: extiende Persona + fechaPrimContacto, pais
- **Empleado**: extiende Persona (campos propios del empleado)
- **Usuario**: id (UUID), username, password (BCrypt), rol (ADMIN|CLIENTE), email, createdAt
  - Relación OneToOne con Cliente (cedula_cliente)
  - Relación ManyToOne con Empleado (cedula_empleado)
- **Cabana**: id (Long), zona, categoria (Estándar|Premium|Suite), cantidadPersonas, precioNoche, fotoUrl, descripcion
  - ManyToMany con Entretenimiento (tabla: cabana_entretenimientos)
  - ManyToMany con Empleado (tabla: cabana_empleados)
- **Contrata**: idContrata, cabana (FK), cliente (FK), numPersonas, fechaInicio, cantDias
- **Entretenimiento**: id, nombre

---

## API REST

### Autenticación (`/api/auth` — público)
| Método | Endpoint | Body | Respuesta |
|--------|----------|------|-----------|
| POST | `/api/auth/login` | `{username, password}` | `{username, rol}` |
| POST | `/api/auth/registro` | RegistroDTO | `{mensaje}` |

**Nota**: El login soporta contraseñas en texto plano (datos de prueba) y BCrypt.

### Cabañas (`/api/cabana`)
| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/api/cabana` | Público | Lista todas |
| GET | `/api/cabana/{id}` | Público | Por ID |
| POST | `/api/cabana` | Autenticado | Crear |
| PUT | `/api/cabana/{id}` | Autenticado | Actualizar |
| DELETE | `/api/cabana/{id}` | Autenticado | Eliminar |
| GET | `/api/cabana/zona/{zona}` | Público | Filtrar por zona |
| GET | `/api/cabana/categoria/{cat}` | Público | Filtrar por categoría |

### Reservas (`/api/contrata`)
| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/api/contrata` | Autenticado | Todas (ADMIN) |
| GET | `/api/contrata/mis-reservas?username=X` | Autenticado | Del cliente |
| POST | `/api/contrata` | Autenticado | Crear reserva |
| DELETE | `/api/contrata/{id}` | Autenticado | Cancelar |
| GET | `/api/contrata/stats` | Autenticado | Estadísticas |

### Clientes (`/api/cliente`)
| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/api/cliente` | ADMIN | Lista todos |
| GET | `/api/cliente/{id}` | ADMIN | Por cédula |

### Entretenimientos (`/api/entretenimiento`)
- GET público para listar

---

## Seguridad

- **CSRF**: Desactivado (API REST stateless)
- **CORS**: Permitido desde `localhost:3000` y `localhost:5173`
- **Rutas públicas**: `/api/auth/**`, GET `/api/cabana/**`, GET `/api/entretenimiento/**`
- **Rutas protegidas**: resto de `/api/**` requiere autenticación HTTP Basic (desactivado en config) — en la práctica el frontend maneja sesión en memoria React
- **Roles**: `ADMIN`, `CLIENTE` (prefijados con `ROLE_` en Spring Security)
- **Passwords**: BCrypt para registros nuevos; texto plano soportado para datos de prueba

---

## Frontend (React SPA)

### Páginas / Vistas
- **LoginPage**: Formulario login → POST `/api/auth/login`
- **RegistroPage**: Formulario registro → POST `/api/auth/registro`
- **HomePage**: Dashboard + Catálogo (según `paginaActual`)
  - Dashboard: stats cards, cabañas recientes
  - Catálogo: grid con filtros (zona, categoría, precio, búsqueda)

### Modales
- **DetalleCabanaModal**: Info, entretenimientos, formulario de reserva
- **CabanaFormModal**: Crear/editar cabaña (solo ADMIN)
- **ReservasModal**: Ver y cancelar reservas

### Estado de sesión
- Guardado en estado React (`useState`) — **se pierde al recargar la página**
- No usa localStorage ni cookies

### Estilos
- CSS-in-JS inline (sin librería externa)
- Fuentes: Cormorant Garamond + DM Sans (Google Fonts)
- Variables CSS: `--cream`, `--bark`, `--moss`, `--sky`, `--gold`, `--fog`

---

## Cómo Ejecutar

### Backend
```bash
# Desde la raíz del proyecto
./mvnw spring-boot:run
# O en Windows:
mvnw.cmd spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

La app estará disponible en `http://localhost:5173`

---

## Issues Conocidos / Bugs

1. **`RegistroDTO.getCedula()`** lanza `UnsupportedOperationException` — el registro desde el frontend no envía cédula, pero `RegistroService` llama a `dto.getCedula()`. El registro puede fallar.
2. **Sin persistencia de sesión**: al recargar el navegador se pierde el login.
3. **EmpleadoController / PersonaController**: aparentemente vacíos o sin endpoints REST implementados.
4. **`spring.jpa.hibernate.ddl-auto=update`**: en producción debería ser `validate` o `none`.

---

## Credenciales de Prueba (si existen en BD)

Los usuarios de prueba pueden tener contraseñas en texto plano en la base de datos Supabase.
Verificar con el `DataInitializer.java` para ver si se crean usuarios por defecto al arrancar.
