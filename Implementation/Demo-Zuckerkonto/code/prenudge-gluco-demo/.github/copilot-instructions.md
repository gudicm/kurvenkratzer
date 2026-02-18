Project: prenudge-gluco-demo (Express + Handlebars + lowdb)

- Goal: maintain small demo server that ingests FHIR Observation resources and demonstrates prenudge flows.
- Environment: Node (ESM, "type": "module" in package.json), uses `lowdb` for local JSON persistence, `hbs` for views, `socket.io` for realtime events.
- Coding style: follow the project's `docs/javascript-styles.md` and prefer small, testable functions.
- Security: never include secrets (client_secret, tokens) in code. Mask or read from env when demonstrating.
- Tests / runs:
  - Start dev: `npm run dev`
  - Start: `npm start`
- When generating code: keep changes minimal, add unitable functions, and update `service/` and `routes/` consistently.
- If editing DB files in `tmp/` keep schema backward-compatible and use `uuid` for ids.
