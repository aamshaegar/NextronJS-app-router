# The splash screen

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
  → main window finishes loading /
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
await mainWindow.loadURL(routeURL('/'))
```

> On some Linux window managers, transparency needs a compositor. Without one, the rounded corners show a solid background, and everything else still works.
