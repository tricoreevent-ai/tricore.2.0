# Clean Code Copy Notes

This folder is a clean local duplicate of the TriCore codebase for testing.

## Included

- root runtime files: `package.json`, `package-lock.json`, `README.md`, `.nvmrc`, `server.js`
- root `scripts/`
- `client/src`
- `client/public`
- client config files and package files
- `server/src`
- `server/scripts`
- `server/uploads`
- `client/.env.example`
- `server/.env.example`

## Excluded

- `.git`
- `.cursor`
- `.superdesign`
- `.vscode`
- all `node_modules`
- `client/dist`
- `logs`
- `deploy-temp`
- `design-preview`
- `workshop-assistant`
- deploy/helper batch files at repo root
- `.env production.txt`
- local runtime/debug artifacts

## Purpose

Use this folder when you want to test the existing code in a cleaner workspace without Git metadata and without the extra local clutter from the main repository.
