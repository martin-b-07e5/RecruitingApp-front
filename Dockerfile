# Stage 1: Build the frontend
FROM node:22.19.0 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the frontend
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY src/pages/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
