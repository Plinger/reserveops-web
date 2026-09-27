# Contributing to ReserveOps Web

Read the [frontend architecture](docs/architecture.md) and [development guide](docs/development.md) before changing the dashboard. The separate `reserveops-api` repository owns the OpenAPI contract for the preview response.

## Local setup

Use Node.js 24 and npm. Run `npm ci`, copy `.env.example` to `.env.local`, and run `npm run dev`. Start the separate API on port 4000 for live inventory. The frontend runs at http://localhost:3100. Run `npm run check` and `npm run format:check` before opening a pull request.

## Making a change

1. Agree on an issue scope and acceptance criteria before implementation. For Wave work, wait for assignment through the approved repository's workflow.
2. Keep data retrieval and Zod validation in `src/lib/api`. Keep feature UI under `src/features`.
3. Show loading, error, empty, moving-ledger, and partial-coverage states accurately. Avoid sample totals presented as current data.
4. Use labeled native controls, visible keyboard focus, semantic tables, and linked form errors.
5. In the pull request, include a screenshot or short recording for visible changes and say how the real testnet example was checked.

Do not put backend credentials in `NEXT_PUBLIC_` variables. Keep financial arithmetic on the backend; the frontend displays exact amount strings returned by the API.
