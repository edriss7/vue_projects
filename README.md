# Vue Projects

30 top Vue.js + TypeScript projects, served by an Express server.

---

## Running Locally

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- npm

### Development (hot-reload)

```bash
npm install
npm run dev
```

Opens at **http://localhost:5173** with Vite HMR.

### Production (build + serve)

```bash
npm install
npm run prod
```

Builds the SPA into `dist/` then serves it with Express at **http://localhost:8080**.

Or run the two steps separately:

```bash
npm run build   # type-check + bundle → dist/
npm start       # serve dist/ via Express on port 8080
```

---

## Running with Docker

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/)

### Build the image

```bash
docker build -t vue-projects .
```

### Run

```bash
docker run -p 8080:8080 vue-projects
```

App is available at **http://localhost:8080**.

### Useful Docker commands

```bash
# Run in the background (detached)
docker run -d -p 8080:8080 --name vue-projects vue-projects

# Stop the detached container
docker stop vue-projects

# Remove the stopped container
docker rm vue-projects

# One-liner: rebuild and run, auto-cleanup on exit
docker build -t vue-projects . && docker run --rm -p 8080:8080 vue-projects
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Type-check + bundle into `dist/` |
| `npm start` | Serve `dist/` with Express (port 8080) |
| `npm run prod` | Build then serve in one command |
