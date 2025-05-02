FROM openjdk:23-slim

WORKDIR /app

COPY app-spring/build/libs/*.jar app.jar

EXPOSE 8080

# The environment variables set in Render UI will be available to this entrypoint
ENTRYPOINT ["java", "-jar", "app.jar"]