# ┌─────────────────────────────────────────────────────────────┐
# │ Stage 1: Build WAR with Maven + OpenJDK 11                 │
# └─────────────────────────────────────────────────────────────┘
FROM maven:3.9.11-eclipse-temurin-11 AS builder
WORKDIR /workspace

# 1) Copy POM & download deps
COPY pom.xml ./
# RUN mvn dependency:go-offline -B

# 2) Copy source & package war
COPY src ./src
RUN mvn package -DskipTests -B

# ┌─────────────────────────────────────────────────────────────┐
# │ Stage 2: Deploy on Tomcat 9                                 │
# └─────────────────────────────────────────────────────────────┘
FROM tomcat:9.0-jdk11-openjdk
WORKDIR /usr/local/tomcat

# 3) Clean out default apps
RUN rm -rf webapps/*

# 4) Drop your WAR in as ROOT.war (serves at /)
#    or name it cache-app.war to serve at /cache-app
COPY --from=builder /workspace/target/cache-app-1.0.0-SNAPSHOT.war \
     webapps/ROOT.war

# 5) (Optional) run as non‑root
RUN groupadd -r tomcat \
 && useradd -r -g tomcat --home-dir /usr/local/tomcat --shell /bin/false tomcat \
 && chown -R tomcat:tomcat /usr/local/tomcat

USER tomcat

EXPOSE 8080

