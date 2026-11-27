# Project structure

```
.
├── main/                       # Electron main process
│   ├── main.js                 # entry: app lifecycle, windows, IPC handlers
│   ├── preload.js              # bridge: exposes window.ipc to the renderer
│   └── helpers/
│       ├── create-window.js    # BrowserWindow that remembers size/position
│       ├── splash.js           # splash window + progress()
│       ├── routes.js           # routeURL(): dev/prod URL resolver
│       ├── menu.js             # application menu
│       ├── tray.js             # tray icon + menu
│       └── updater.js          # auto-updates (electron-updater)
│
├── renderer/                   # Next.js 16 app (App Router)
│   ├── app/
│   │   ├── (main)/             # route group: normal app windows
│   │   │   ├── layout.jsx      # root layout: nav + ViewTransition
│   │   │   ├── loading.jsx     # loading fallback (Suspense)
│   │   │   ├── page.jsx        # → / (home)
│   │   │   └── next/
│   │   │       ├── page.jsx    # → /next (Server Component)
│   │   │       └── panels.jsx  # client component (Activity demo)
│   │   └── (splash)/           # route group: splash window only
│   │       ├── layout.jsx      # transparent root layout
│   │       └── splash/page.jsx # → /splash
│   ├── components/
│   │   ├── use-ipc.js          # useIpc(channel, handler) hook
│   │   ├── theme-toggle.jsx    # dark/light/system toggle button
│   │   └── theme-script.js     # applies the saved theme before paint
│   ├── styles/                 # global CSS + CSS Modules
│   ├── public/                 # static files, served at / (incl. tray.png)
│   └── next.config.js
│
├── scripts/
│   └── run.mjs                 # runs npm commands (dev/start/build, --desktop)
├── docs/                       # this VitePress documentation site
├── resources/                  # app icons for electron-builder
├── electron-builder.yml        # packaging config (name, id, icons, targets)
├── app/                        # ⚠ build output (generated, git-ignored)
└── dist/                       # ⚠ installers (generated, git-ignored)
```
