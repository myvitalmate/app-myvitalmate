FROM azul/zulu-openjdk:23-jdk AS builder
WORKDIR /app
COPY . .
RUN chmod +x ./gradlew
RUN ./gradlew bootJar

FROM azul/zulu-openjdk:23-jdk-headless
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080

# The environment variables set in Render UI will be available to this entrypoint
ENTRYPOINT ["java", "-jar", "app.jar"]
