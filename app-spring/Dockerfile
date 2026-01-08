FROM azul/zulu-openjdk:23 AS builder
WORKDIR /app
COPY . .
RUN chmod +x ./gradlew
RUN ./gradlew bootJar

FROM azul/zulu-openjdk:23
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080

# The environment variables set in Render UI will be available to this entrypoint
ENTRYPOINT ["java", "-jar", "app.jar"]
