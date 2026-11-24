// Plain module (no 'use client') so Server Component layouts can inline it.
export const THEME_KEY = 'theme' // 'light' | 'dark' | 'system'

// Runs before first paint (inlined in <head>) so there's no light→dark flash.
export const themeScript = `(function(){try{var t=localStorage.getItem('${THEME_KEY}')||'system';var d=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark')}catch(e){}})()`
