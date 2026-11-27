import path from 'path'
import { app, Menu, Tray, nativeImage } from 'electron'

const isProd = process.env.NODE_ENV === 'production'

// renderer/public/tray.png is exported next to main.js in prod (app/tray.png).
const iconPath = () =>
  isProd
    ? path.join(import.meta.dirname, 'tray.png')
    : path.join(process.cwd(), 'renderer', 'public', 'tray.png')

let tray = null // keep a reference, or the tray icon gets garbage-collected

export const createTray = (getWindow) => {
  const icon = nativeImage.createFromPath(iconPath()).resize({ width: 16, height: 16 })
  tray = new Tray(icon)
  tray.setToolTip(app.getName())

  const show = () => {
    const win = getWindow()
    if (!win) return
    if (win.isMinimized()) win.restore()
    win.show()
    win.focus()
  }

  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: 'Show', click: show },
      { type: 'separator' },
      { label: 'Quit', role: 'quit' },
    ]),
  )
  tray.on('click', show)
  return tray
}
