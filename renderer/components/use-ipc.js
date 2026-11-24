'use client'

import { useEffect } from 'react'

/**
 * Subscribe to an IPC channel from the main process.
 * Auto-unsubscribes on unmount. `window.ipc` comes from main/preload.js.
 *
 *   useIpc('message', (msg) => console.log(msg))
 */
export function useIpc(channel, handler) {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ipc) return
    return window.ipc.on(channel, handler)
    // handler is intentionally not a dependency: pass a useEffectEvent
    // or a stable setter (React Compiler also stabilizes it).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel])
}
