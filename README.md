# ReserveOps Web

This Next.js dashboard shows a read-only inventory of Stellar sponsored reserves. Enter a public **testnet** sponsor address to see sponsored accounts, trustlines, and signers, their XLM reserve requirements, and any coverage gap reported by the [ReserveOps API](https://github.com/Plinger/reserveops-api).

The preview does not decide whether sponsorship can be revoked or prepare transactions. It needs no wallet connection or private key.

## Run locally

Requires Node.js 24 and npm.

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Skip the copy if the local environment file already exists.

- [Architecture and project plan](docs/architecture.md)
- [Development and configuration](docs/development.md)
- [Contributor guide](CONTRIBUTING.md)

Run npm run check for the validation pipeline and npm run format:check for formatting.
Production: npm run build then npm start.
Open http://localhost:3100. Start the separate API on port 4000 for a live connection.

The home page now accepts a public Stellar testnet sponsor address and displays the API's live read-only inventory. Select **Inspect testnet example** to view the project's public five-unit fixture. MongoDB is not required for this preview.

To contribute, read [CONTRIBUTING.md](CONTRIBUTING.md) and the [open dashboard issues](https://github.com/Plinger/reserveops-web/issues). The [API backlog](https://github.com/Plinger/reserveops-api/blob/main/docs/contributor-backlog.md) also includes longer-term dashboard work.
