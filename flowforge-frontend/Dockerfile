# ===================================================================
# TaskFlowe - React 18 + Vite Frontend Multi-Stage Dockerfile
# ===================================================================

# -------------------------------------------------------------------
# STAGE 1: Build Stage using Node 20 Alpine
# -------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package dependency definitions first for optimal layer caching
COPY package.json package-lock.json ./

# Install dependencies cleanly
RUN npm ci

# Copy application source files and compile Vite production bundle
COPY . .
RUN npm run build

# -------------------------------------------------------------------
# STAGE 2: Runtime Web Server Stage using Nginx Alpine
# -------------------------------------------------------------------
FROM nginx:1.25-alpine

# Copy custom production Nginx reverse proxy configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled React static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port 80
EXPOSE 80

# Healthcheck monitoring Nginx web server
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Launch Nginx in foreground mode
CMD ["nginx", "-g", "daemon off;"]
