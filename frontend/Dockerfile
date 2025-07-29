# Stage 1: Build React app
FROM node:18-alpine AS build

WORKDIR /app
COPY package.json yarn.lock* ./
RUN npm install       # or yarn install

COPY public ./public
COPY src ./src
COPY .env ./.env

RUN npm run build

# serve build with a static server…
# e.g. install serve: npm install --global serve
# CMD ["serve", "-s", "build", "-l", "3000"]

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# Remove default Nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy built React files
COPY --from=build /app/build /usr/share/nginx/html

# Optional: Add healthcheck or nginx config
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]


FROM node:18-alpine


