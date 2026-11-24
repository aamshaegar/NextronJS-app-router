# Opening new windows

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
