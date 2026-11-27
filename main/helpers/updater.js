import { app } from 'electron'
import updaterPkg from 'electron-updater'

const { autoUpdater } = updaterPkg

// Checks for updates using the `publish` settings in electron-builder.yml.
// Only runs in a packaged app: there is nothing to update in dev.
export const initUpdater = (getWindow) => {
  if (!app.isPackaged) return

  const notify = (status, info) => getWindow()?.webContents.send('updater:status', { status, info })

  autoUpdater.on('checking-for-update', () => notify('checking'))
  autoUpdater.on('update-available', (info) => notify('available', info))
  autoUpdater.on('update-not-available', () => notify('none'))
  autoUpdater.on('download-progress', (p) => notify('downloading', { percent: p.percent }))
  autoUpdater.on('update-downloaded', (info) => notify('downloaded', info))
  autoUpdater.on('error', (err) => notify('error', { message: err.message }))

  // Downloads in the background and installs on the next quit.
  autoUpdater.checkForUpdatesAndNotify().catch(() => {})
}

// Call from IPC to restart now and install a downloaded update.
export const installUpdate = () => autoUpdater.quitAndInstall()
