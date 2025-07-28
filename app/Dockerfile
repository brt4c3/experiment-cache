FROM tomcat:9.0-jdk11-openjdk

EXPOSE 8080

# Remove default webapps
RUN rm -rf /usr/local/tomcat/webapps/*

# Create non-root tomcat user
#RUN groupadd -r tomcat && \
#    useradd -r -g tomcat --home-dir /usr/local/tomcat --shell /bin/false tomcat

# Set permissions for logs and temp dirs
#RUN mkdir -p /usr/local/tomcat/logs && \
#    chown -R tomcat:tomcat /usr/local/tomcat/logs /usr/local/tomcat/temp /usr/local/tomcat/webapps

# Copy your app
#COPY target/webapp.war /usr/local/tomcat/webapps/ROOT.war
#RUN chown tomcat:tomcat /usr/local/tomcat/webapps/ROOT.war

# Switch to tomcat user
#USER tomcat

# Run Tomcat
CMD ["catalina.sh", "run"]
