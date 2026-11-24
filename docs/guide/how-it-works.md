# How it works

An Electron app has two kinds of processes:

| Process | Folder | Runs | Can access |
|---|---|---|---|
| **Main** | `main/` | Node.js | File system, OS, windows, native APIs |
| **Renderer** | `renderer/` | Chromium (your Next.js UI) | DOM only, plus whatever `preload.js` exposes |

```
┌──────────────── main process (Node) ───────────────┐
│ main/main.js                                       │
│   ├─ creates splash window → loads /splash         │
│   ├─ creates main window (hidden) → loads /        │
│   └─ when ready: shows main, closes splash         │
└──────────────┬────────────────────────────────────┘
               │ IPC (window.ipc via preload.js)
┌──────────────▼──── renderer (Next.js 16) ─────────┐
│ renderer/app/**/page.jsx                           │
└────────────────────────────────────────────────────┘
```

- **Dev:** `nextron` starts `next dev` on port **3000** and Electron loads `http://localhost:3000/<route>`. To use another port, change `--renderer-port` in the `dev` script in `package.json`.
- **Prod:** Next does a **static export** into `app/`, and `electron-serve` serves it as `app://./<route>`.

[`main/helpers/routes.js`](https://github.com/aamshaegar/NextronJS-app-router/blob/main/main/helpers/routes.js) hides this difference. Always use `routeURL('/my-page')`.
