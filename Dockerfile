# Stage 1: Build the frontend
FROM node:22.19.0 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
# Inject environment variable during build
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# Stage 2: Serve the frontend
FROM nginx:alpine
# Use a build argument to specify the Nginx config file
ARG NGINX_CONFIG=nginx.conf
#ARG NGINX_CONFIG=nginx-remote.conf
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ${NGINX_CONFIG} /etc/nginx/conf.d/default.conf
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
