# Creating pages

In the App Router, **a folder is a route** and **`page.jsx` makes it reachable**.

### Step by step: add a `/settings` page

**1.** Create `renderer/app/(main)/settings/page.jsx`:

```jsx
export const metadata = { title: 'Settings' }

export default function SettingsPage() {
  return <h1>Settings</h1>
}
```

**2.** Link to it from anywhere:

```jsx
import Link from 'next/link'
<Link href="/settings">Settings</Link>
```

**3.** (Optional) Add it to the nav in `renderer/app/(main)/layout.jsx`.

That's it. It inherits the nav, styles and page transition from the `(main)` layout.

### Special files

| File | Purpose |
|---|---|
| `page.jsx` | The UI for a route (required to make it reachable) |
| `layout.jsx` | Wraps the page and its child routes, and persists across navigation |
| `loading.jsx` | Shown while the segment loads |
| `error.jsx` | Error boundary for the segment (must be `'use client'`) |
| `not-found.jsx` | UI for `notFound()` |

### Nested routes

```
app/(main)/settings/page.jsx           → /settings
app/(main)/settings/account/page.jsx   → /settings/account
```

### Dynamic routes (`[id]`)

Static export must know every value at build time, so add `generateStaticParams`:

```jsx
// app/(main)/notes/[id]/page.jsx
export function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }]
}

export default async function Note({ params }) {
  const { id } = await params      // Next 16: params is a Promise
  return <h1>Note {id}</h1>
}
```

> For data known only at runtime (such as user files), use a single static page plus a query string (`/note?id=42`) and read it with `useSearchParams()` inside a client component.
