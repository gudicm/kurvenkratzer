Database (lowdb) conventions

- Storage: JSON files managed by `lowdb` (see `service/db.js`).
- Collections: `users`, `measurements`, `tokens`, `tasks`.
- IDs: use `uuid` v4 strings for primary keys.
- Measurements: store minimal FHIR mapping:
  {
    "id": "<uuid>",
    "patientId": "<uuid>",
    "loinc": "15074-8",
    "value": 40,
    "unit": "mg/dl",
    "effectiveDateTime": "2026-02-17T20:34:07.673Z",
    "source": "device|manual"
  }
- Tokens/Secrets: store only if required for demo, but redact before committing.
- Migration: prefer additive changes; include a short migration function in `service/db.js` when altering schema.
