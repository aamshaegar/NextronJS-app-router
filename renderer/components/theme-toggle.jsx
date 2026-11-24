'use client'

import { useEffect, useState } from 'react'

import { THEME_KEY as KEY } from './theme-script'

const systemDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches

export function applyTheme(choice) {
  const dark = choice === 'dark' || (choice === 'system' && systemDark())
  document.documentElement.classList.toggle('dark', dark)
}

/**
 * Cycles light → dark → system. The choice is saved in localStorage.
 * The anti-flash script in the layout applies it before React loads.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState(null) // null until mounted (avoids hydration mismatch)

  useEffect(() => {
    setTheme(localStorage.getItem(KEY) || 'system')
  }, [])

  // Follow OS changes while in "system" mode
  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyTheme('system')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [theme])

  const next = { light: 'dark', dark: 'system', system: 'light' }
  const icon = { light: '☀️', dark: '🌙', system: '💻' }

  const cycle = () => {
    const value = next[theme]
    localStorage.setItem(KEY, value)
    applyTheme(value)
    setTheme(value)
  }

  return (
    <button
      onClick={cycle}
      title={theme ? `Theme: ${theme}` : 'Theme'}
      className="ml-auto flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-1 text-sm
                 text-zinc-700 transition hover:bg-black/10
                 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10"
    >
      <span aria-hidden>{theme ? icon[theme] : '·'}</span>
      <span className="capitalize">{theme ?? ''}</span>
    </button>
  )
}
