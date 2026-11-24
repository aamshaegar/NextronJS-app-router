# Commands

| Command | What it does | URL / window |
|---|---|---|
| `npm run dev` | Next.js dev server only, with hot reload, opened in your browser | http://localhost:3000 |
| `npm run dev --desktop` | Desktop app in dev mode (`nextron`): Electron + Next dev server, DevTools open | Electron window |
| `npm run start` | Builds the static export and serves it as production, opened in your browser | http://localhost:3000 |
| `npm run start --desktop` | Builds `app/` (no installers) and runs Electron in production mode | Electron window |
| `npm run build` | Full build plus installers (AppImage/snap on Linux) | `dist/` |

- All commands run through [`scripts/run.mjs`](https://github.com/aamshaegar/NextronJS-app-router/blob/main/scripts/run.mjs). npm passes `--desktop` to it as `npm_config_desktop=true`.
- **Next.js telemetry is disabled.** `scripts/run.mjs` sets `NEXT_TELEMETRY_DISABLED=1` for every command, so no anonymous usage data is sent. If you run `next` directly, outside the npm scripts, also run `npx next telemetry disable` once to switch it off for your machine.
- `PORT=4000 npm run dev` changes the port. `BROWSER=none npm run dev` doesn't open the browser.
- In the browser, `window.ipc` doesn't exist, so Electron-only features (such as the IPC button) do nothing there. Check `if (window.ipc)` before using it.
- `http://localhost:3000/` is the same home page the desktop app opens, and `/splash` shows the splash screen.
- The VS Code debug task (`.vscode/tasks.json`) runs `npm run dev --desktop` and attaches to the main process on port 9292 and the renderer on port 5858.
