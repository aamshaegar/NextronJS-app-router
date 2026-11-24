import path from 'path'
import { BrowserWindow } from 'electron'
import { routeURL } from './routes.js'

// A small, frameless, always-on-top window that renders the /splash route.
// It is NOT state-persisted (unlike createWindow) - it always opens centered.
export const createSplash = () => {
  const splash = new BrowserWindow({
    width: 420,
    height: 300,
    frame: false,
    resizable: false,
    movable: false,
    center: true,
    show: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    transparent: true,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(import.meta.dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  splash.once('ready-to-show', () => splash.show())
  splash.loadURL(routeURL('/splash'))

  // Send boot progress (0-100) + a status label to the splash page.
  const progress = (value, label) => {
    if (!splash.isDestroyed()) {
      splash.webContents.send('splash:progress', { value, label })
    }
  }

  return { window: splash, progress }
}
