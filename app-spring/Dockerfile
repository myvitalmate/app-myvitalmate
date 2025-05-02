FROM openjdk:23-slim AS builder
WORKDIR /app
COPY . .
RUN ./gradlew bootJar

FROM openjdk:23-slim
WORKDIR /app
COPY --from=builder /app/app-spring/build/libs/*.jar app.jar
EXPOSE 8080

# The environment variables set in Render UI will be available to this entrypoint
ENTRYPOINT ["java", "-jar", "app.jar"]