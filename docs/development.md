# Frontend development

Use Node.js 24 and npm. Run npm ci on a clean clone, copy .env.example to .env.local once, then npm run dev.

NEXT_PUBLIC_API_URL defaults to http://localhost:4000. This value is public and built into browser assets; rebuild after production URL changes. Never store credentials here. Backend CORS_ORIGIN must match the frontend origin.

## Commands

- npm run dev: development server on port 3100.
- npm run lint: ESLint.
- npm run typecheck: generate route types and check TypeScript.
- npm run build then npm start: production build/server.
- npm run check: lint, typecheck, production build.
- npm run format / npm run format:check: Prettier.

Builds work without a running API. The page checks API liveness in the browser with a timeout and retry support. Liveness does not imply database readiness; inspect /ready separately.

The home page also has a testnet sponsor form. Its **Inspect testnet example** action uses a public fixture address and requests the backend's `/v1/testnet/sponsors/{sponsorId}/inventory` endpoint. The browser validates address shape; the backend validates the Stellar checksum. The response is parsed with Zod before rendering. The page shows when the ledger moved or the report covers only part of a sponsor's commitments.

Keep feature UI together. Use semantic controls, keyboard focus states and accessible status messages. Validate external API data. Backend amounts arrive as strings.

System fonts avoid network font downloads during builds. No browser test suite is installed yet; add meaningful workflow tests when sponsor/scan behavior exists.
