# Gearboxd Frontend (Vite + React)

A starter frontend for Gearboxd with public/auth/protected routes, a car-themed design system, and modular API clients.

## Requirements

- Node.js 18+
- npm 9+

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure environment variables by creating a `.env` file at the repository root:

   ```bash
   VITE_API_BASE_URL=http://localhost:8080
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

- `src/api/` API client modules (`client.ts`, `cars.ts`, `auth.ts`)
- `src/types/` type definitions for car and auth payloads
- `src/components/` layout and protected route components
- `src/pages/` route pages
