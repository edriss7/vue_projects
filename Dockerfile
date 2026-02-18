# ─────────────────────────────────────────────────────────────────────────────
# Vue Projects — Dockerfile
# Two-stage build:
#   Stage 1 (builder) — install deps, type-check, and bundle with Vite
#   Stage 2 (runner)  — copy only what's needed to serve the app
#
# NOTE: tsx (the server runtime) lives in devDependencies, so rather than
#       reinstalling, we reuse node_modules straight from the builder stage.
#
# ─────────────────────────────────────────────────────────────────────────────
# HOW TO RUN
# ─────────────────────────────────────────────────────────────────────────────
#
#   # 1. Build the image
#   docker build -t vue-projects .
#
#   # 2. Run — app will be available at http://localhost:8080
#   docker run -p 8080:8080 vue-projects
#
#   # Run in the background (detached mode)
#   docker run -d -p 8080:8080 --name vue-projects vue-projects
#
#   # Stop the detached container
#   docker stop vue-projects
#
#   # Remove the stopped container
#   docker rm vue-projects
#
#   # One-liner: rebuild and run, auto-cleanup on exit
#   docker build -t vue-projects . && docker run --rm -p 8080:8080 vue-projects
#
# ─────────────────────────────────────────────────────────────────────────────
# DEVELOPMENT (hot-reload, no Docker)
# ─────────────────────────────────────────────────────────────────────────────
#
#   npm install      # install dependencies
#   npm run dev      # Vite dev server with HMR at http://localhost:8080
#
# ─────────────────────────────────────────────────────────────────────────────


# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  STAGE 1 — builder                                                        ║
# ║  Full install (devDeps included) so vue-tsc and vite are available.       ║
# ╚══════════════════════════════════════════════════════════════════════════╝
FROM node:22-alpine AS builder

WORKDIR /app

# Copy manifests first — Docker caches this layer until they change
COPY package.json package-lock.json ./

# Install all dependencies (devDeps needed for vue-tsc + vite build)
RUN npm ci

# Copy the rest of the project source
COPY . .

# Type-check and bundle — output lands in /app/dist
RUN npm run build


# ╔══════════════════════════════════════════════════════════════════════════╗
# ║  STAGE 2 — runner                                                         ║
# ║  Copies the compiled bundle and node_modules from the builder.            ║
# ║  node_modules is reused because tsx (the server runtime) is a            ║
# ║  devDependency and would be missing if we ran npm ci --omit=dev here.    ║
# ╚══════════════════════════════════════════════════════════════════════════╝
FROM node:22-alpine AS runner

WORKDIR /app

# Bring in the package manifest (needed so npm run start resolves correctly)
COPY package.json ./

# Reuse the full node_modules from builder (includes tsx for server.ts)
COPY --from=builder /app/node_modules ./node_modules

# Copy the Vite-compiled SPA bundle
COPY --from=builder /app/dist ./dist

# Copy the Express server entry point (tsx runs it at startup)
COPY server.ts ./

EXPOSE 8080

# Runs: tsx server.ts  — serves /dist via Express on port 8080
CMD ["npm", "run", "start"]
