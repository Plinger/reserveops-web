# ReserveOps architecture and project plan

## Purpose

Help Stellar wallet and payment businesses inspect current sponsored-reserve commitments, understand why they can or cannot end, and eventually review release or transfer plans. The sponsor's XLM stays in its account but reserve requirements constrain spending. Inactivity does not automatically permit revocation. Customer assets are not the sponsor's funds to recover.

## Repository boundaries

reserveops-web owns presentation. reserveops-api owns business logic, Stellar access, database records and the API shared by the dashboard and external integrations. Keep one implementation. A future SDK can be separate.

MongoDB stores application records and indexed snapshots; Stellar is the source of truth for chain state. Organizations, tracked sponsor addresses, scan jobs, snapshots, reports, API-key hashes and audit records are planned entities. Define schemas after the discovery proof determines requirements.

## Correctness and security

- Use bigint for integer stroop calculations and decimal strings in JSON/storage. Never use floating-point balance arithmetic.
- Record network, ledger reference, source, ingestion time and coverage with snapshots.
- Start with accounts and ordinary asset trustlines; explicitly label unsupported entries and partial coverage.
- Historical sponsorship operation counts do not establish current sponsorship state.
- Evaluate sequences of proposed changes together, considering balances and liabilities.
- Do not accept private keys. Future transaction signing remains external.
- Authentication, organization isolation, scoped hashed API keys and quotas must precede exposed business endpoints.
- Never put backend credentials in NEXT_PUBLIC variables.
- Report loading, unavailable, stale, empty and partial states honestly.

## Milestones

1. Foundation (done): configuration, packages, health/readiness, API connection indicator, lint, build, tests, CI and docs.
2. Testnet discovery proof (done for accounts, ordinary trustlines, and signers): create known scenarios and verify current sponsors, entries and reserve calculations.
3. Read-only preview (done): a bounded testnet endpoint and dashboard view with an example sponsor, exact amounts, and coverage warnings.
4. Authenticated organization scans, persisted inventory, broader entry coverage, and pilot feedback.
5. Explainable release/transfer plans, unsigned transaction export and post-execution verification.

Authentication, scanning, business models and transaction planning are not implemented by the foundation. Queue technology is deferred until the discovery proof; Redis is not required initially. Demand and Wave admission remain unvalidated.

## Planned API (not implemented)

- POST /v1/sponsors
- GET /v1/sponsors
- GET /v1/sponsors/:id
- POST /v1/sponsors/:id/scans
- GET /v1/scans/:id
- GET /v1/sponsors/:id/inventory
- GET /v1/sponsors/:id/summary

The backend OpenAPI document lists only implemented endpoints. The current preview is public testnet data; future organization data requires authentication.

## References

- https://developers.stellar.org/docs/build/guides/transactions/sponsored-reserves
- https://github.com/stellar/stellar-protocol/blob/master/core/cap-0033.md
- https://docs.drips.network/wave/

## Frontend structure

- src/app: App Router pages, layouts, providers.
- src/features: feature-local components/hooks; future sponsors, inventory, reports, settings.
- src/features/system: current API connection indicator.
- src/components/ui: reusable presentation components when needed.
- src/lib/api: backend client and response validation.
- src/lib/config: public configuration validation.
- src/types: shared frontend-only types.

Use server components by default and isolate interactive queries in client components. TanStack Query owns remote client state; instantiate its client per provider. Do not duplicate reserve arithmetic in React. Table/form libraries are installed for upcoming work and are not unnecessarily imported into the initial page.
