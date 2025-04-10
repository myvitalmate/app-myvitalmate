If wanted you can also create a customAplication.properties file to import to the existing application.properties files
by adding:

spring.config.import=classpath:customApplication.properties

added configurations for the application.

used apis:

```
spoonacular.api.key=MY_API_KEY
openai.api.key=MY_OPENAI_API_KEY
```

used chat configuration:

````
openai.api.model=gpt-4o-mini
openai.api.url=https://api.openai.com/v1/chat/completions
spring.api.ollama.chat.options.model=llama3.2
````

used database configuration

````
spring.datasource.url=databaseUrl
spring.datasource.username=username
spring.datasource.password=password
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
````