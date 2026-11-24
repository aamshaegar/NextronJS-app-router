# Building and packaging

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
