# Guía de Despliegue — Mar Azul

## Arquitectura de producción

```
Usuario → Vercel (Frontend React) → Railway (Backend Spring Boot) → Supabase (PostgreSQL)
```

---

## 1. Backend en Railway

### Pasos

1. Crea una cuenta en [railway.app](https://railway.app) y un nuevo proyecto.
2. Conecta tu repositorio de GitHub (o sube el código).
3. Railway detecta el `Dockerfile` automáticamente gracias a `railway.toml`.
4. En **Variables de entorno** del servicio, agrega:

| Variable | Valor |
|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://aws-1-us-west-2.pooler.supabase.com:6543/postgres?sslmode=require` |
| `SPRING_DATASOURCE_USERNAME` | `postgres.mgssrqfsmbitiobsvrlw` |
| `SPRING_DATASOURCE_PASSWORD` | `fUVzg4B9xLb7piJx` |
| `DDL_AUTO` | `validate` |
| `CORS_ALLOWED_ORIGINS` | `https://TU-APP.vercel.app` *(actualizar después del paso 2)* |

5. Railway asigna `$PORT` automáticamente — el `application.properties` ya lo lee.
6. Copia la URL pública que Railway genera (ej. `https://marazul-backend.up.railway.app`).

---

## 2. Frontend en Vercel

### Pasos

1. Crea una cuenta en [vercel.com](https://vercel.com) y un nuevo proyecto.
2. Conecta el repositorio y configura:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. En **Environment Variables** agrega:

| Variable | Valor |
|---|---|
| `VITE_API_URL` | URL del backend de Railway (ej. `https://marazul-backend.up.railway.app`) |

4. Despliega. Copia la URL de Vercel (ej. `https://marazul.vercel.app`).
5. Vuelve a Railway y actualiza `CORS_ALLOWED_ORIGINS` con esa URL.
6. Actualiza también `vercel.json` → campo `destination` con la URL real del backend.

---

## 3. Docker (local o VPS)

```bash
# Copia y edita las variables
copy .env.example .env

# Construye y levanta
docker compose up --build -d

# Ver logs
docker compose logs -f
```

- Frontend: `http://localhost:80`
- Backend: `http://localhost:8070`

---

## Variables de entorno — resumen

| Variable | Dónde | Descripción |
|---|---|---|
| `PORT` | Railway | Puerto del servidor (Railway lo inyecta solo) |
| `SPRING_DATASOURCE_URL` | Railway / Docker | URL JDBC de Supabase |
| `SPRING_DATASOURCE_USERNAME` | Railway / Docker | Usuario de la BD |
| `SPRING_DATASOURCE_PASSWORD` | Railway / Docker | Contraseña de la BD |
| `DDL_AUTO` | Railway / Docker | `validate` en prod, `update` en dev |
| `CORS_ALLOWED_ORIGINS` | Railway / Docker | URL(s) del frontend separadas por coma |
| `VITE_API_URL` | Vercel | URL base del backend: `https://marazulback.onrender.com` |

---

## Checklist antes de desplegar

- [ ] `DDL_AUTO=validate` en producción (no `update`)
- [ ] `CORS_ALLOWED_ORIGINS` apunta a la URL real de Vercel
- [ ] `VITE_API_URL` apunta a la URL real de Railway
- [ ] `vercel.json` tiene la URL correcta del backend en el rewrite de `/api`
- [ ] `.env` **no** está commiteado (está en `.gitignore`)
