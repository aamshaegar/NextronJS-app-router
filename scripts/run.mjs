#!/usr/bin/env node
/**
 * Task runner behind the npm scripts.
 *
 *   npm run dev               → Next.js dev server only, opened in your browser
 *   npm run dev --desktop     → Nextron desktop app (dev, hot reload)
 *   npm run start             → static production build served and opened in your browser
 *   npm run start --desktop   → Nextron desktop app (production build, unpackaged)
 *   npm run build             → full build + installers in dist/
 *
 * `--desktop` is read by npm itself and passed to scripts as the
 * env var npm_config_desktop=true. `node scripts/run.mjs dev --desktop` works too.
 * Set BROWSER=none to skip opening the browser, and PORT=xxxx to change the port.
 */
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'

const PORT = Number(process.env.PORT) || 3000
const ROOT = path.resolve(import.meta.dirname, '..')
const RENDERER = 'renderer'
const OUT = 'app' // static export + bundled main process (see next.config.js)

const [task] = process.argv.slice(2)
const desktop =
  process.argv.includes('--desktop') ||
  ['true', '1', ''].includes(process.env.npm_config_desktop ?? 'unset')

const log = (msg) => console.log(`\x1b[36m[run]\x1b[0m ${msg}`)

// Run a local binary (node_modules/.bin) and resolve when it exits with code 0.
function run(cmd, args, { env = {}, keepAlive = false } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd: ROOT,
      stdio: 'inherit',
      shell: process.platform === 'win32',
      env: { ...process.env, ...env, PATH: `${path.join(ROOT, 'node_modules', '.bin')}${path.delimiter}${process.env.PATH}` },
    })
    const stop = () => child.kill('SIGINT')
    process.on('SIGINT', stop)
    process.on('SIGTERM', stop)
    child.on('exit', (code) => {
      if (keepAlive || code === 0) resolve(code)
      else reject(new Error(`${cmd} exited with code ${code}`))
    })
  })
}

// Open a URL in the default browser once the server answers.
async function openWhenReady(url) {
  if (process.env.BROWSER === 'none') return log(`Ready on ${url} (BROWSER=none, not opening)`)
  for (let i = 0; i < 120; i++) {
    try {
      const res = await fetch(url)
      if (res.ok || res.status === 404) break
    } catch {}
    await new Promise((r) => setTimeout(r, 500))
  }
  log(`Opening ${url}`)
  const opener =
    process.platform === 'darwin' ? ['open', [url]]
    : process.platform === 'win32' ? ['cmd', ['/c', 'start', '', url]]
    : ['xdg-open', [url]]
  spawn(opener[0], opener[1], { stdio: 'ignore', detached: true }).on('error', () =>
    log(`Could not open a browser automatically. Visit ${url}`),
  ).unref()
}

const tasks = {
  // ---------- development ----------
  async dev() {
    if (desktop) {
      log(`Desktop dev: Electron + next dev on port ${PORT}`)
      return run('nextron', ['--renderer-port', String(PORT)], { keepAlive: true })
    }
    log(`Browser dev: http://localhost:${PORT}`)
    openWhenReady(`http://localhost:${PORT}`)
    return run('next', ['dev', '-p', String(PORT), RENDERER], { keepAlive: true })
  },

  // ---------- production ----------
  async start() {
    if (desktop) {
      // nextron build --no-pack: builds renderer + main into app/ without installers
      log('Desktop prod: building app/ (no installers)…')
      await run('nextron', ['build', '--no-pack'])
      log('Launching Electron in production mode')
      return run('electron', ['.'], { env: { NODE_ENV: 'production' }, keepAlive: true })
    }
    // `next start` doesn't work with output: 'export', so serve the static files.
    log('Browser prod: building static export…')
    await run('next', ['build', RENDERER], { env: { NODE_ENV: 'production' } })
    if (!existsSync(path.join(ROOT, OUT, 'index.html'))) throw new Error(`${OUT}/index.html not found`)
    log(`Serving ${OUT}/ on http://localhost:${PORT}`)
    openWhenReady(`http://localhost:${PORT}`)
    return run('serve', [OUT, '-l', String(PORT), '--no-clipboard'], { keepAlive: true })
  },

  async build() {
    return run('nextron', ['build'])
  },
}

if (!tasks[task]) {
  console.error(`Unknown task "${task}". Use: dev | start | build  (add --desktop for Electron)`)
  process.exit(1)
}

tasks[task]().catch((err) => {
  console.error(`\x1b[31m[run]\x1b[0m ${err.message}`)
  process.exit(1)
})
