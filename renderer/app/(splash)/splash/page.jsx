'use client'

import { useState } from 'react'
import Image from 'next/image'
import s from '../../../styles/splash.module.css'
import { useIpc } from '../../../components/use-ipc'

export default function SplashPage() {
  const [{ value, label }, setProgress] = useState({ value: 0, label: 'Starting…' })

  // Main process sends { value, label } on 'splash:progress' (see main/helpers/splash.js)
  useIpc('splash:progress', setProgress)

  return (
    <div className={s.root}>
      <div className={s.inner}>
        <Image className={s.logo} src="/images/logo.png" alt="" width={72} height={72} priority />
        <p className={s.title}>Next.js App Router Electron</p>
        <p className={s.label}>{label}</p>
        <div className={s.track}>
          <div className={s.bar} style={{ width: `${value}%` }} />
        </div>
        <p className={s.version}>v1.0.0</p>
      </div>
    </div>
  )
}
