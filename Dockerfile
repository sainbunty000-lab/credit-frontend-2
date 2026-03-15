# ── Build stage ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Serve stage ───────────────────────────────────────────────────────────────
FROM nginx:stable-alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our SPA-friendly template (uses $PORT at runtime)
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Cloud Run injects PORT at runtime (default 8080).
# nginx docker image expands *.template files via envsubst on startup.
ENV PORT=8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
