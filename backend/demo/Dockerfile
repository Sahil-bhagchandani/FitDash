# ---- Build Stage ----
    FROM maven:3.9.4-eclipse-temurin-21 AS builder
    WORKDIR /app
    COPY . .
    RUN mvn clean package -DskipTests
    
    # ---- Run Stage ----
    FROM eclipse-temurin:21-jdk
    WORKDIR /app
    COPY --from=builder /app/target/*.jar demo.jar
    EXPOSE 8080
    ENTRYPOINT ["java", "-jar", "demo.jar"]
    