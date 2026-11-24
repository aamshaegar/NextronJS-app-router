import path from 'path'
import { app, ipcMain } from 'electron'
import serve from 'electron-serve'
import { createWindow } from './helpers/create-window.js'
import { createSplash } from './helpers/splash.js'
import { routeURL } from './helpers/routes.js'

const isProd = process.env.NODE_ENV === 'production'

// Minimum time the splash stays visible, so it never just "flashes".
const SPLASH_MIN_MS = 1800

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

;(async () => {
  await app.whenReady()
  const startedAt = Date.now()

  // 1. Splash first - it is tiny and appears almost instantly.
  const splash = createSplash()
  splash.progress(10, 'Starting…')

  // 2. Main window is created hidden and loads in the background.
  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    show: false,
    webPreferences: {
      preload: path.join(import.meta.dirname, 'preload.js'),
    },
  })

  splash.progress(35, 'Loading interface…')

  // ---- Put your real startup work here (DB, config, updates…) ----
  // await initDatabase(); splash.progress(60, 'Opening database…')
  await wait(400)
  splash.progress(65, 'Preparing workspace…')

  await mainWindow.loadURL(routeURL('/'))
  splash.progress(100, 'Ready')

  // 3. Respect the minimum splash time, then swap windows.
  const elapsed = Date.now() - startedAt
  if (elapsed < SPLASH_MIN_MS) await wait(SPLASH_MIN_MS - elapsed)

  mainWindow.show()
  if (!splash.window.isDestroyed()) splash.window.close()
  if (!isProd) mainWindow.webContents.openDevTools()
})()

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('message', async (event, arg) => {
  event.reply('message', `${arg} World!`)
})
