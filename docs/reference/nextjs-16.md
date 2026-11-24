# Next.js 16 features

| Feature | Where | What it gives you |
|---|---|---|
| **Turbopack (default)** | automatic | Fast dev server and builds, with a filesystem cache that speeds up restarts |
| **React Compiler** | `reactCompiler: true` in `next.config.js` | Automatic memoization. Requires `babel-plugin-react-compiler`, which is installed |
| **`<ViewTransition>`** | `(main)/layout.jsx` + `globals.css` | Animated page changes using the browser's View Transitions API |
| **`<Activity>`** | `next/panels.jsx` | Hides UI while keeping its state and DOM |
| **`useEffectEvent`** | `(main)/page.jsx` | Effect callbacks that see the latest state without re-subscribing |
| **Async `params` / `searchParams`** | dynamic routes | `const { id } = await params` |
| **`metadata` title templates** | `(main)/layout.jsx` | `'%s · Next.js App Router Electron'` |
| **Multiple root layouts** | `(main)` and `(splash)` | Different HTML shells per window |

### Not available here (because of static export)

Server Actions, Route Handlers (`app/api/...`), `cookies()` / `headers()`, ISR or revalidation, middleware/proxy, the image optimizer and Cache Components. **Do that work in the main process and use IPC instead.**
