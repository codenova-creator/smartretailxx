# ==============================================================================
# SmartRetailX Frontend Dockerfile (Context: Workspace Root)
# ==============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests from frontend directory
COPY frontend/package.json frontend/package-lock.json* ./

# Install dependencies
RUN npm ci || npm install

# Copy frontend source code
COPY frontend/ ./

# Build production Vite bundle
RUN npm run build

# Production Nginx server
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
