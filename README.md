# Nextron App Router Starter

A desktop app starter built with **Electron 43 + Next.js 16 (App Router) + React 19.2**, on top of [nextron](https://github.com/saltyshiomix/nextron).

It includes:

- 🚀 **A splash screen**: a frameless, transparent window with a progress bar driven by the main process
- 🧭 **The App Router** (`renderer/app/`) with route groups and two root layouts
- ⚛️ **React Compiler**, so you rarely need `useMemo` / `useCallback`
- ⚡ **Turbopack** (the default in Next 16) for dev and build
- 🎞 **`<ViewTransition>`** for animated page changes
- 🗂 **`<Activity>`** for hidden UI that keeps its state
- 🎯 **`useEffectEvent`** for effects without stale closures
- 🔌 **A `useIpc()` hook** for type-free, safe IPC through `contextBridge`

---

## Table of contents

1. [Quick start](#1-quick-start)
2. [How it works](#2-how-it-works)
3. [Project structure](#3-project-structure)
4. [Creating pages](#4-creating-pages)
5. [Layouts and route groups](#5-layouts-and-route-groups)
6. [Server vs Client Components](#6-server-vs-client-components)
7. [Talking to Electron (IPC)](#7-talking-to-electron-ipc)
8. [The splash screen](#8-the-splash-screen)
9. [Opening new windows](#9-opening-new-windows)
10. [Next.js 16 features used](#10-nextjs-16-features-used)
11. [Styling](#11-styling)
12. [Building and packaging](#12-building-and-packaging)
13. [Rules and limitations](#13-rules-and-limitations)
14. [Troubleshooting](#14-troubleshooting)

---

## 1. Quick start

```bash
git clone git@github.com:aamshaegar/NextronJS-app-router.git
cd NextronJS-app-router
npm install
npm run dev      # dev mode: hot reload + DevTools
npm run build    # production installers in dist/
```

Requirements: Node.js 20 or later.

---

## 2. How it works

An Electron app has two kinds of processes:

| Process | Folder | Runs | Can access |
|---|---|---|---|
| **Main** | `main/` | Node.js | File system, OS, windows, native APIs |
| **Renderer** | `renderer/` | Chromium (your Next.js UI) | DOM only, plus whatever `preload.js` exposes |

```
┌──────────────── main process (Node) ───────────────┐
│ main/main.js                                       │
│   ├─ creates splash window → loads /splash         │
│   ├─ creates main window (hidden) → loads /home    │
│   └─ when ready: shows main, closes splash         │
└──────────────┬────────────────────────────────────┘
               │ IPC (window.ipc via preload.js)
┌──────────────▼──── renderer (Next.js 16) ─────────┐
│ renderer/app/**/page.jsx                           │
└────────────────────────────────────────────────────┘
```

- **Dev:** `nextron` starts `next dev` on port 8888 and Electron loads `http://localhost:8888/<route>`.
- **Prod:** Next does a **static export** into `app/`, and `electron-serve` serves it as `app://./<route>`.

[`main/helpers/routes.js`](main/helpers/routes.js) hides this difference. Always use `routeURL('/my-page')`.

---

## 3. Project structure

```
.
├── main/                       # Electron main process
│   ├── main.js                 # entry: app lifecycle, windows, IPC handlers
│   ├── preload.js              # bridge: exposes window.ipc to the renderer
│   └── helpers/
│       ├── create-window.js    # BrowserWindow that remembers size/position
│       ├── splash.js           # splash window + progress()
│       └── routes.js           # routeURL(): dev/prod URL resolver
│
├── renderer/                   # Next.js 16 app (App Router)
│   ├── app/
│   │   ├── (main)/             # route group: normal app windows
│   │   │   ├── layout.jsx      # root layout: nav + ViewTransition
│   │   │   ├── loading.jsx     # loading fallback (Suspense)
│   │   │   ├── home/page.jsx   # → /home
│   │   │   └── next/
│   │   │       ├── page.jsx    # → /next (Server Component)
│   │   │       └── panels.jsx  # client component (Activity demo)
│   │   └── (splash)/           # route group: splash window only
│   │       ├── layout.jsx      # transparent root layout
│   │       └── splash/page.jsx # → /splash
│   ├── components/
│   │   └── use-ipc.js          # useIpc(channel, handler) hook
│   ├── styles/                 # global CSS + CSS Modules
│   ├── public/                 # static files, served at /
│   └── next.config.js
│
├── resources/                  # app icons for electron-builder
├── electron-builder.yml        # packaging config (name, id, icons, targets)
├── app/                        # ⚠ build output (generated, git-ignored)
└── dist/                       # ⚠ installers (generated, git-ignored)
```

---

## 4. Creating pages

In the App Router, **a folder is a route** and **`page.jsx` makes it reachable**.

### Step by step: add a `/settings` page

**1.** Create `renderer/app/(main)/settings/page.jsx`:

```jsx
export const metadata = { title: 'Settings' }

export default function SettingsPage() {
  return <h1>Settings</h1>
}
```

**2.** Link to it from anywhere:

```jsx
import Link from 'next/link'
<Link href="/settings">Settings</Link>
```

**3.** (Optional) Add it to the nav in `renderer/app/(main)/layout.jsx`.

That's it. It inherits the nav, styles and page transition from the `(main)` layout.

### Special files

| File | Purpose |
|---|---|
| `page.jsx` | The UI for a route (required to make it reachable) |
| `layout.jsx` | Wraps the page and its child routes, and persists across navigation |
| `loading.jsx` | Shown while the segment loads |
| `error.jsx` | Error boundary for the segment (must be `'use client'`) |
| `not-found.jsx` | UI for `notFound()` |

### Nested routes

```
app/(main)/settings/page.jsx           → /settings
app/(main)/settings/account/page.jsx   → /settings/account
```

### Dynamic routes (`[id]`)

Static export must know every value at build time, so add `generateStaticParams`:

```jsx
// app/(main)/notes/[id]/page.jsx
export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }]
}

export default async function Note({ params }) {
  const { id } = await params      // Next 16: params is a Promise
  return <h1>Note {id}</h1>
}
```

> For data known only at runtime (such as user files), use a single static page plus a query string (`/note?id=42`) and read it with `useSearchParams()` inside a client component.

---

## 5. Layouts and route groups

A folder in parentheses, like `(main)`, is a **route group**. It organizes files **without adding to the URL**.

This project has **two root layouts**:

- `(main)/layout.jsx` is the dark app shell with the nav.
- `(splash)/layout.jsx` has a transparent `<html>`/`<body>` for the frameless splash.

Each root layout renders its own `<html>` and `<body>`. To add another kind of window (for example a tray popup), create `app/(popup)/layout.jsx` plus `app/(popup)/popup/page.jsx`.

---

## 6. Server vs Client Components

App Router components are **Server Components by default**. Here, "server" means **build time**, because the app is statically exported.

| Need | Use |
|---|---|
| Static content, metadata, no interactivity | Server Component (default) |
| `useState`, `useEffect`, event handlers, `window`, `window.ipc` | Put `'use client'` at the top |

Pattern: keep `page.jsx` as a server component, and move the interactive parts into a small `'use client'` component next to it (see `next/page.jsx` and `next/panels.jsx`).

> ⚠ `export const metadata` only works in Server Components. In a client page, set `document.title` in an effect.

---

## 7. Talking to Electron (IPC)

The renderer **cannot** use Node or Electron directly (`contextIsolation: true`). It talks to the main process through `window.ipc`, defined in `main/preload.js`:

```js
window.ipc.send(channel, value)          // renderer → main
window.ipc.on(channel, cb)  // → unsubscribe()   main → renderer
```

### Step by step: add a "read a file" feature

**1. Main process** (`main/main.js`):

```js
import fs from 'fs/promises'

ipcMain.on('file:read', async (event, filePath) => {
  const text = await fs.readFile(filePath, 'utf8')
  event.reply('file:content', text)
})
```

**2. Renderer** (any client component):

```jsx
'use client'
import { useState } from 'react'
import { useIpc } from '../../../components/use-ipc'

export default function Reader() {
  const [text, setText] = useState('')
  useIpc('file:content', setText)

  return (
    <>
      <button onClick={() => window.ipc.send('file:read', '/etc/hostname')}>Read</button>
      <pre>{text}</pre>
    </>
  )
}
```

`useIpc` subscribes on mount and unsubscribes on unmount. If your handler reads changing state, wrap it in `useEffectEvent` (see `home/page.jsx`).

### Request/response style (optional)

To use `await`, add an `invoke` to `preload.js`:

```js
invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
```

```js
// main
ipcMain.handle('app:version', () => app.getVersion())
// renderer
const v = await window.ipc.invoke('app:version')
```

> 🔒 Never expose `ipcRenderer` itself or Node modules through the preload. Expose small, specific functions.

---

## 8. The splash screen

Files:

- `main/helpers/splash.js` creates the window and provides `progress(value, label)`
- `main/main.js` holds the startup sequence
- `renderer/app/(splash)/splash/page.jsx` is the UI
- `renderer/styles/splash.module.css` is the look

### Startup sequence

```
app ready
  → splash window shown (420×300, frameless, transparent, always on top)
  → main window created with show:false
  → progress(…) updates sent to the splash over 'splash:progress'
  → main window finishes loading /home
  → wait until at least SPLASH_MIN_MS have passed
  → mainWindow.show(); splash.close()
```

### Customize it

| Want to… | Change |
|---|---|
| Change the minimum display time | `SPLASH_MIN_MS` in `main/main.js` |
| Run real startup tasks | Replace the `await wait(400)` placeholder in `main/main.js` with your work, calling `splash.progress(n, 'label')` between steps |
| Change the size | `width` / `height` in `main/helpers/splash.js` |
| Change the look | `splash.module.css` and `splash/page.jsx` |
| Turn it off | Remove `createSplash()` and its calls, and drop `show: false` from the main window |

Example with real work:

```js
splash.progress(20, 'Loading settings…')
await loadSettings()
splash.progress(50, 'Opening database…')
await openDb()
splash.progress(80, 'Loading interface…')
await mainWindow.loadURL(routeURL('/home'))
```

> On some Linux window managers, transparency needs a compositor. Without one, the rounded corners show a solid background, and everything else still works.

---

## 9. Opening new windows

```js
import { createWindow } from './helpers/create-window.js'
import { routeURL } from './helpers/routes.js'

const settings = createWindow('settings', {
  width: 600,
  height: 400,
  webPreferences: { preload: path.join(import.meta.dirname, 'preload.js') },
})
settings.loadURL(routeURL('/settings'))
```

The first argument (`'settings'`) is the key under which the window's size and position are saved by `electron-store`.

---

## 10. Next.js 16 features used

| Feature | Where | What it gives you |
|---|---|---|
| **Turbopack (default)** | automatic | Fast dev server and builds, with a filesystem cache that speeds up restarts |
| **React Compiler** | `reactCompiler: true` in `next.config.js` | Automatic memoization. Requires `babel-plugin-react-compiler`, which is installed |
| **`<ViewTransition>`** | `(main)/layout.jsx` + `globals.css` | Animated page changes using the browser's View Transitions API |
| **`<Activity>`** | `next/panels.jsx` | Hides UI while keeping its state and DOM |
| **`useEffectEvent`** | `home/page.jsx` | Effect callbacks that see the latest state without re-subscribing |
| **Async `params` / `searchParams`** | dynamic routes | `const { id } = await params` |
| **`metadata` title templates** | `(main)/layout.jsx` | `'%s · My Nextron App'` |
| **Multiple root layouts** | `(main)` and `(splash)` | Different HTML shells per window |

### Not available here (because of static export)

Server Actions, Route Handlers (`app/api/...`), `cookies()` / `headers()`, ISR or revalidation, middleware/proxy, the image optimizer and Cache Components. **Do that work in the main process and use IPC instead.**

---

## 11. Styling

- **Global CSS** (`styles/globals.css`) holds CSS variables (`--bg`, `--accent`, …) and resets. Import it only in root layouts.
- **CSS Modules** (`*.module.css`) are scoped per component: `import s from './x.module.css'`, then `className={s.card}`.
- Static images go in `renderer/public/` and are referenced as `/images/x.png`.
- Tailwind can be added too: `npm i -D tailwindcss @tailwindcss/postcss`, add `renderer/postcss.config.mjs`, then add `@import "tailwindcss";` to `globals.css`.

---

## 12. Building and packaging

```bash
npm run build                 # current OS
npx nextron build --linux     # or --win / --mac
```

The build runs three steps:
1. `next build renderer` → static export in `app/`
2. webpack bundles `main/` → `app/main.js`, `app/preload.js`
3. `electron-builder` → installers in `dist/` (Linux: AppImage + snap)

Configure the name, app ID, icons and targets in `electron-builder.yml`.

**Icons:** `resources/icon.png` (256×256 or larger, used on Linux), `resources/icon.ico` (Windows), `resources/icon.icns` (macOS). The `.icns` must contain PNG frames, or the Linux build fails, which is why `linux.icon` points to the PNG.

---

## 13. Rules and limitations

1. `output: 'export'` and `distDir: '../app'` are **required** by nextron. Don't remove them.
2. Every route must be static at build time. Dynamic routes need `generateStaticParams`.
3. Anything that uses `window`, `window.ipc` or hooks needs `'use client'`.
4. Keep Node and OS work in `main/`. The renderer is just a web page.
5. The same URL can't be defined in two route groups.
6. Images use `unoptimized: true`, because there's no image server.

---

## 14. Troubleshooting

| Problem | Fix |
|---|---|
| `Could not extract a PNG frame from ICNS file` | Provide `resources/icon.png` and set `linux.icon` in `electron-builder.yml` |
| `window is not defined` | The component is missing `'use client'`, or `window` is used outside an effect or handler |
| `window.ipc is undefined` | The window was created without `preload` in `webPreferences` |
| A page is blank in prod but works in dev | Use `routeURL()`. Keep `trailingSlash: true`. Check that the route was exported (build log "Route (app)") |
| `You cannot have two parallel pages that resolve to the same path` | The same route exists in two route groups |
| The splash never closes | Check that the main window's `loadURL` resolves, and look at the terminal for errors |

---

## License

MIT
