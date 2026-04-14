# gearboxd-frontend-codex

## Run with Docker

```bash
docker compose up --build
```

The app is exposed on [http://localhost:5173](http://localhost:5173).

## Configure backend endpoint

1. Copy `.env.example` to `.env`.
2. Set `VITE_API_BASE_URL` to your backend URL.
3. Rebuild the frontend image:

```bash
docker compose up --build
```

## Vite environment behavior in containers

This setup uses **build-time** environment injection for Vite (`ARG VITE_API_BASE_URL` in the Dockerfile). That means changing `VITE_API_BASE_URL` requires rebuilding the image.

If you need true runtime switching without rebuilds, use an entrypoint script to replace placeholders in generated static files before Nginx starts.
