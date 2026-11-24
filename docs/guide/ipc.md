# Talking to Electron (IPC)

The renderer **cannot** use Node or Electron directly (`contextIsolation: true`). It talks to the main process through `window.ipc`, defined in `main/preload.js`:

```js
window.ipc.send(channel, value)          // renderer → main
window.ipc.on(channel, cb)  // → unsubscribe()   main → renderer
```

### Step by step: add a "read a file" feature

**1. Main process** (`main/main.js`):

```js
import fs from 'fs/promises'

ipcMain.on('file:read', async (event, filePath) => {
  const text = await fs.readFile(filePath, 'utf8')
  event.reply('file:content', text)
})
```

**2. Renderer** (any client component):

```jsx
'use client'
import { useState } from 'react'
import { useIpc } from '../../../components/use-ipc'

export default function Reader() {
  const [text, setText] = useState('')
  useIpc('file:content', setText)

  return (
    <>
      <button onClick={() => window.ipc.send('file:read', '/etc/hostname')}>Read</button>
      <pre>{text}</pre>
    </>
  )
}
```

`useIpc` subscribes on mount and unsubscribes on unmount. If your handler reads changing state, wrap it in `useEffectEvent` (see `(main)/page.jsx`).

### Request/response style (optional)

To use `await`, add an `invoke` to `preload.js`:

```js
invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
```

```js
// main
ipcMain.handle('app:version', () => app.getVersion())
// renderer
const v = await window.ipc.invoke('app:version')
```

> 🔒 Never expose `ipcRenderer` itself or Node modules through the preload. Expose small, specific functions.
