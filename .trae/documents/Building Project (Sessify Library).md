## Objective
- Install dependencies and execute TypeScript compilation to generate `dist/` output (JS and type declarations).

## Pre-compilation Checks
- Read `package.json` to confirm `scripts.build` is `tsc` and entry points `main: dist/index.js`, `types: dist/index.d.ts` are correctly set.
- Use the local Node version (reference `.nvmrc` if it exists), otherwise use the current environment directly.
- Install dependencies: prefer `npm ci` (if `package-lock.json` exists), otherwise use `npm install`.

## Execute Compilation
- Run `npm run build` (uses `outDir: dist` from `tsconfig.json`).

## Result Validation
- Check if the following files are generated: `dist/index.js`, `dist/index.d.ts` and related files.
- Confirm there are no TypeScript errors or missing module references.
- Verify that package entry points match the output (`package.json`'s `main`/`types` point to existing files).

## Common Issues Handling
- If DOM type missing or TS configuration warnings occur, add `lib: ["ES6", "DOM"]` to `tsconfig.json` when necessary (only adjust if compilation fails).
- If package name changes affect document import examples, this doesn't impact compilation; if needed, I can update the examples after compilation.

## Optional Follow-up Steps
- Run `npm run test` to validate unit tests (if available).
- Output a brief report: dependency installation/compilation log summary and output file list.