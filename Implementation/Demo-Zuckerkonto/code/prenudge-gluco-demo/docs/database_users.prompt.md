# database_users.prompt.md
Intent:
Given a JSON database schema for `users`, generate a JavaScript/TypeScript interface and example CRUD functions.

Inputs:
- JSON schema (example):
{
  "id": "uuid",
  "username": "string",
  "email": "string",
  "roles": ["string"],
  "createdAt": "ISO8601"
}

Instructions for the agent:
- Output a TypeScript `User` interface.
- Provide small `createUser`, `getUserById`, and `updateUser` function signatures using `lowdb`.
- Keep error handling minimal but explicit.
