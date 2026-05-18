# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar manifiestos primero para aprovechar cache de capas
COPY package.json package-lock.json ./
RUN npm ci

# Copiar el resto del código y construir
COPY . .
RUN npm run build

# ─── Stage 2: Serve con Nginx ─────────────────────────────────────────────────
FROM nginx:alpine

# Copiar el build de Vite al directorio de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuración de Nginx: proxy /api → backend + SPA fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
