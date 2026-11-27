# Menus, tray, updates and signing

### App menu

`main/helpers/menu.js` sets a standard menu (File, Edit, View, Window, Help, plus the app menu on macOS). Edit the `template` array to add items:

```js
{ label: 'Settings…', accelerator: 'CmdOrCtrl+,', click: () => openSettings() }
```

### Tray icon

`main/helpers/tray.js` adds a tray icon with **Show** and **Quit**. The image is `renderer/public/tray.png`, which the static export copies next to `main.js`. To remove the tray, delete the `createTray(...)` call in `main/main.js`.

> On some Linux desktops (such as GNOME without the AppIndicator extension), tray icons are hidden.

### macOS behavior

Closing every window quits the app on Windows and Linux. On macOS the app keeps running, and clicking the dock icon opens a new main window, as macOS users expect.

### Auto-updates

`main/helpers/updater.js` uses [electron-updater](https://www.electron.build/auto-update). In a packaged app it checks GitHub Releases on startup, downloads in the background and installs on the next quit. It does nothing in dev.

1. Set `publish` in `electron-builder.yml` to your repo (already set to this one).
2. Bump `version` in `package.json`.
3. Build and upload a release:
   ```bash
   GH_TOKEN=<github token> npx nextron build --publish always
   ```

The renderer can follow progress and restart to install:

```jsx
useIpc('updater:status', ({ status, info }) => console.log(status, info))
window.ipc.send('updater:install')
```

Updates work for AppImage, Windows (NSIS) and macOS (signed builds only), but not for snap, which updates through the Snap Store.

### Code signing

Unsigned apps trigger SmartScreen on Windows and Gatekeeper on macOS. electron-builder signs automatically when these environment variables are set:

| Variable | Used for |
|---|---|
| `CSC_LINK` | Path or base64 of your `.p12` (macOS) or `.pfx` (Windows) certificate |
| `CSC_KEY_PASSWORD` | The certificate's password |
| `APPLE_ID`, `APPLE_APP_SPECIFIC_PASSWORD`, `APPLE_TEAM_ID` | macOS notarization |

Never commit certificates or passwords. In CI, store them as secrets. Without them, the build is unsigned and still works.
