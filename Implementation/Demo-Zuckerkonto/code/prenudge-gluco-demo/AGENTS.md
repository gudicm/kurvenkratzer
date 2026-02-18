Agents for this workspace

- default: General assistant for code and docs edits.
- tracing: Focused on tracing and middleware (files: middleware/*, ws.js, routes/api.js).
- db: Lowdb/schema agent (files: service/*.js, tmp/*.json, tmp/*.jsonl).
- ui: Handlebars and public assets (views/*, public/*).

Usage: prefix a file or directory to indicate the intended agent. Each agent should obey `.github/copilot-instructions.md` and repo conventions.
