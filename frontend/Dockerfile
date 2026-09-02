# ==============================================================================
# Stage 1: Build Vite React SPA Frontend
# ==============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json* ./

# Install clean dependencies
RUN npm ci || npm install

# Copy source code and config files
COPY . .

# Build production distribution bundle
RUN npm run build

# ==============================================================================
# Stage 2: Serve Production Assets via High-Performance Nginx
# ==============================================================================
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP Port 80 for AWS ECS / ALB
EXPOSE 80

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
