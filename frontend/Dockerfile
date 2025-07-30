# ┌──────────────────────────┐
# │ Stage 1: Build React App │
# └──────────────────────────┘
FROM node:18-alpine AS builder

# 1. Set workdir, copy manifest, install deps
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install --production 

# Don't force fix vulnerabilities in production builds
COPY public ./public
COPY src    ./src

# 2. Copy source, inject BACKEND_URL at build time
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL}

# 3. Build the static assets
RUN npm run build

# ┌────────────────────────────────┐
# │ Stage 2: Serve via Nginx 🚀   │
# └────────────────────────────────┘
FROM nginx:stable-alpine

# 4. Remove default content
RUN rm -rf /usr/share/nginx/html/*

# 5. Add custom nginx.conf (see next)
COPY nginx.conf /etc/nginx/nginx.conf

# 6. Copy built assets
COPY --from=builder /app/build /usr/share/nginx/html

# 7. Healthcheck for orchestration
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget --quiet --tries=1 --spider http://localhost/healthz || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
# ┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
# │ nginx.conf: Nginx config for serving the React app. See https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/. │
# └──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
