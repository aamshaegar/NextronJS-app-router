# Troubleshooting

| Problem | Fix |
|---|---|
| `Could not extract a PNG frame from ICNS file` | Provide `resources/icon.png` and set `linux.icon` in `electron-builder.yml` |
| `window is not defined` | The component is missing `'use client'`, or `window` is used outside an effect or handler |
| `window.ipc is undefined` | The window was created without `preload` in `webPreferences` |
| A page is blank in prod but works in dev | Use `routeURL()`. Keep `trailingSlash: true`. Check that the route was exported (build log "Route (app)") |
| `You cannot have two parallel pages that resolve to the same path` | The same route exists in two route groups |
| The splash never closes | Check that the main window's `loadURL` resolves, and look at the terminal for errors |
