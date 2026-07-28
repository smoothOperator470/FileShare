# Multi-stage production Dockerfile for Render deployment
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app

# Skip downloading Cypress test binary during container build
ENV CYPRESS_INSTALL_BINARY=0

# Copy pom.xml and source files
COPY pom.xml .
COPY frontend ./frontend
COPY src ./src

# Build production JAR (skipping unit tests during Docker build)
RUN mvn clean package -DskipTests

# Production JRE runtime image (lightweight)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy built JAR from stage 1
COPY --from=builder /app/target/file-share-1.1.4.jar app.jar

EXPOSE 5000

# Start Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]