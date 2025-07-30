# ┌─────────────────────────────────────────────────────────────┐
# │ Stage 3: Node Exporter                                     │
# └─────────────────────────────────────────────────────────────┘
FROM prom/node-exporter:latest AS node-exporter
# Node Exporter デフォルトのENTRYPOINT/CMDをそのまま使います
EXPOSE 9100

# ┌─────────────────────────────────────────────────────────────┐
# │ Stage 1: Build WAR with Maven + OpenJDK 11                 │
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
# │ Stage 2: Deploy on Tomcat 9                                 │
# └─────────────────────────────────────────────────────────────┘
FROM tomcat:9.0-jdk11-openjdk AS runtime

# Create non-root 'tomcat' user and GC log directory
RUN groupadd -r tomcat \
 && useradd -r -g tomcat --home-dir /usr/local/tomcat --shell /bin/false tomcat \
 && mkdir -p /var/log/cacheapp \
 && chown -R tomcat:tomcat /var/log/cacheapp

# JVM GC Logging via unified logging (Java 11+)
ENV JAVA_TOOL_OPTIONS="-Xlog:gc*:file=/var/log/cacheapp/gc.log:time,level"

# Deploy the application
WORKDIR /usr/local/tomcat
RUN rm -rf webapps/*
COPY --from=builder /workspace/target/cache-app-1.0.0-SNAPSHOT.war webapps/ROOT.war

# Ensure Tomcat home owned by 'tomcat'
RUN chown -R tomcat:tomcat /usr/local/tomcat

USER tomcat
EXPOSE 8080
