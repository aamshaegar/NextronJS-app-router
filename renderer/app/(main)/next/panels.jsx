'use client'

import { Activity, useState } from 'react'
import s from '../../../styles/app.module.css'

// React 19.2 <Activity>: hidden tabs stay mounted and keep their state
// (try typing in tab A, switch to B, come back - the text is still there).
export function Panels() {
  const [tab, setTab] = useState('a')
  return (
    <div className={s.card}>
      <button className={s.button} onClick={() => setTab('a')}>Tab A</button>{' '}
      <button className={s.button} onClick={() => setTab('b')}>Tab B</button>
      <Activity mode={tab === 'a' ? 'visible' : 'hidden'}>
        <p>Tab A: <input placeholder="type something" /></p>
      </Activity>
      <Activity mode={tab === 'b' ? 'visible' : 'hidden'}>
        <p>Tab B: <input placeholder="and here" /></p>
      </Activity>
    </div>
  )
}
