# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

# Copiar archivos de Maven primero (mejor cache de capas)
COPY mvnw mvnw.cmd pom.xml ./
COPY .mvn .mvn

# Descargar dependencias sin compilar el código fuente
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Copiar el código fuente y compilar
COPY src ./src
RUN ./mvnw package -DskipTests -B

# ─── Stage 2: Runtime ─────────────────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Crear usuario no-root por seguridad
RUN addgroup -S marazul && adduser -S marazul -G marazul

# Copiar el JAR generado
COPY --from=builder /app/target/*.jar app.jar

RUN chown marazul:marazul app.jar
USER marazul

EXPOSE 8070

ENTRYPOINT ["java", "-jar", "app.jar"]
