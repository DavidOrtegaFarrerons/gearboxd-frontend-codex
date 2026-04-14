# Gearboxd Frontend (Vite + React)

A starter frontend for Gearboxd with public/auth/protected routes, a car-themed design system, and modular API clients.

## Requirements

- Node.js 18+
- npm 9+
- Docker (optional, for containerized runs)

## Getting Started (Local Development)

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables by creating a `.env` file at the repository root:

   ```bash
   VITE_API_BASE_URL=http://localhost:4000
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Build for production:

   ```bash
   npm run build
   ```

5. Preview production build:

   ```bash
   npm run preview
   ```

## Docker

Run the app with Docker Compose:

```bash
docker compose up --build
```

The frontend is served on [http://localhost:5173](http://localhost:5173).

### Configure backend endpoint

`VITE_API_BASE_URL` is used by Vite at **build time**. The Docker setup passes this value as a build argument, so changing the backend endpoint requires a rebuild.

1. Update your `.env` (or export it in shell):

   ```bash
   VITE_API_BASE_URL=http://localhost:4000
   ```

2. Rebuild and start:

   ```bash
   docker compose up --build
   ```

### CORS note for separate frontend/backend deployments

If frontend and API are hosted on different origins, backend CORS must explicitly allow the exact frontend origin, for example:

- `https://gearboxd.davidortegafarrerons.com` (no trailing slash)

## Routes

### Public

- `/` car list
- `/cars/:carId` car detail
- `/healthcheck` health status

### Auth

- `/auth/register`
- `/auth/activate`
- `/auth/login`

### Protected (requires `gearboxd-token` in localStorage)

- `/cars/create`
- `/cars/edit`
- `/cars/delete`

## Project Structure

- `src/api/http.ts` shared HTTP wrapper with API base URL, auth header injection, and normalized errors
- `src/api/cars.ts` typed car APIs for listing/detail/create/update/delete
- `src/api/users.ts` user registration/activation APIs
- `src/api/auth.ts` authentication token API
- `src/types/` type definitions for shared payloads
- `src/components/` layout and protected route components
- `src/pages/` route pages
