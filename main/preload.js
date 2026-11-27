import { contextBridge, ipcRenderer } from 'electron'

const handler = {
  // renderer → main (fire and forget)
  send(channel, value) {
    ipcRenderer.send(channel, value)
  },
  // renderer → main → renderer (await the result of ipcMain.handle)
  invoke(channel, ...args) {
    return ipcRenderer.invoke(channel, ...args)
  },
  // main → renderer; returns an unsubscribe function
  on(channel, callback) {
    const subscription = (_event, ...args) => callback(...args)
    ipcRenderer.on(channel, subscription)

    return () => {
      ipcRenderer.removeListener(channel, subscription)
    }
  },
}

contextBridge.exposeInMainWorld('ipc', handler)
