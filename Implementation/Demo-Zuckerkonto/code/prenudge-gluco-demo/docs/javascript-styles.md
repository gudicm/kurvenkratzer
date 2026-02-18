JavaScript style for prenudge-gluco-demo

- Module style: ESM (`import` / `export`), keep `type: "module"`.
- Use `const` and `let`; prefer `const` where possible.
- Async: prefer `async/await`. Handle errors with try/catch and return meaningful errors.
- Logging: use `debug()` for internal logs, `morgan` for HTTP traces. Do not log secrets.
- Promises: avoid mixing callbacks and promises; wrap callback APIs where needed.
- Formatting: 2-space indent, semi-colons optional but be consistent.
- Tests: write small functions that can be unit tested; keep side effects isolated in `service/`.
