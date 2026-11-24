'use client'

import { useEffect, useEffectEvent, useState } from 'react'
import Image from 'next/image'
import s from '../../../styles/app.module.css'
import { useIpc } from '../../../components/use-ipc'

export default function HomePage() {
  const [message, setMessage] = useState('No message found')
  const [count, setCount] = useState(0)

  // React 19.2 useEffectEvent: always reads the latest `count`,
  // without making the effect re-subscribe when count changes.
  const onMessage = useEffectEvent((msg) => setMessage(`${msg} (clicks: ${count})`))
  useIpc('message', onMessage)

  useEffect(() => {
    document.title = 'Home · My Nextron App'
  }, [])

  return (
    <>
      <h1>⚡ Electron + Next.js 16 ⚡</h1>
      <Image src="/images/logo.png" alt="Logo" width={128} height={128} />
      <div className={s.card}>
        <button
          className={s.button}
          onClick={() => {
            setCount((c) => c + 1)
            window.ipc.send('message', 'Hello')
          }}
        >
          Test IPC
        </button>
        <p>{message}</p>
      </div>
    </>
  )
}
