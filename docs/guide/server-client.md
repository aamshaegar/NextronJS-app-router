# Server vs Client Components

App Router components are **Server Components by default**. Here, "server" means **build time**, because the app is statically exported.

| Need | Use |
|---|---|
| Static content, metadata, no interactivity | Server Component (default) |
| `useState`, `useEffect`, event handlers, `window`, `window.ipc` | Put `'use client'` at the top |

Pattern: keep `page.jsx` as a server component, and move the interactive parts into a small `'use client'` component next to it (see `next/page.jsx` and `next/panels.jsx`).

> ⚠ `export const metadata` only works in Server Components. In a client page, set `document.title` in an effect.
