# --- Construction : Maven télécharge les dépendances, lance les tests, puis
#     produit le jar. Les dépendances sont dans une couche à part : elles ne
#     sont re-téléchargées que si le pom.xml change.
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -B -q dependency:go-offline
COPY src ./src
RUN mvn -B -q package

# --- Exécution : une JRE seule, sans les outils de construction, et un
#     utilisateur sans droits d'administration.
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
USER 1000:1000
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
