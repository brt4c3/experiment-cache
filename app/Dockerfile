FROM tomcat:9.0-jdk11-openjdk

EXPOSE 8080

# Remove default webapps
RUN rm -rf /usr/local/tomcat/webapps/*

# Create non-root tomcat user
RUN groupadd -r tomcat && \
    useradd -r -g tomcat --home-dir /usr/local/tomcat --shell /bin/false tomcat

# Set permissions for logs and temp dirs
RUN mkdir -p /usr/local/tomcat/logs && \
    chown -R tomcat:tomcat /usr/local/tomcat/logs /usr/local/tomcat/temp /usr/local/tomcat/webapps

# Copy your app
RUN mkdir -p /usr/local/tomcat/webapps/cache-app
COPY target/cache-app-1.0.0-SNAPSHOT /usr/local/tomcat/webapps/cache-app
RUN chown tomcat:tomcat /usr/local/tomcat/webapps/cache-app -R
RUN chmod +rwx /usr/local/tomcat/webapps/cache-app -R

# Switch to tomcat user
USER tomcat

# Run Tomcat
CMD ["catalina.sh", "run"]
