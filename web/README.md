# Algorithms Web App

This workspace contains the React + Vite frontend for browsing algorithms, comparing implementations, and exploring learning patterns generated from the repository content.

## Scripts

Run these commands from the repository root:

- `npm run dev` starts the Vite development server for the `web` workspace.
- `npm run build` creates a production build of the frontend.
- `npm run test` runs the web workspace test suite.
- `npm run build:data` regenerates the algorithm JSON consumed by the app.
- `npm run build:patterns` rebuilds the learning-pattern index used by the Learn section.

## Key Structure

- `src/routes.tsx` centralizes route definitions and primary navigation metadata so the header and router stay aligned.
- `src/pages` contains the top-level screens rendered by the router.
- `src/components` holds shared UI building blocks such as layout, code viewers, and visualizers.
- `src/context` stores cross-page state providers.
- `public/data` contains generated JSON files consumed at runtime.

## Workflow

When you add or rename pages:

1. Update `src/routes.tsx` so the route table and header navigation stay in sync.
2. Rebuild generated data with `npm run build:data` or `npm run build:patterns` if the page depends on repository content.
3. Run `npm run lint --workspace=web` before shipping UI changes.
