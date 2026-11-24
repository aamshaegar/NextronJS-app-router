# Styling, Tailwind and themes

### Tailwind CSS v4 (preinstalled)

Tailwind is set up through `renderer/postcss.config.mjs`, with `@import "tailwindcss";` at the top of `styles/globals.css`. Use utility classes anywhere:

```jsx
<h1 className="text-3xl font-bold text-violet-400">Hello</h1>
<button className="rounded-lg bg-violet-600 px-4 py-2 hover:bg-violet-500">Save</button>
```

There's no `tailwind.config.js` in v4. Customize the theme in CSS:

```css
/* styles/globals.css */
@theme {
  --color-brand: #7c5cff;
  --font-display: "Inter", sans-serif;
}
/* now usable: bg-brand, text-brand, font-display */
```

> Tailwind's reset (Preflight) removes default margins and heading sizes, so style elements with classes.

### Dark / light theme

The toggle in the nav ([`components/theme-toggle.jsx`](https://github.com/aamshaegar/NextronJS-app-router/blob/main/renderer/components/theme-toggle.jsx)) cycles through **light → dark → system** and saves the choice in `localStorage`.

How it works:
1. The toggle adds or removes the `dark` class on `<html>`.
2. `globals.css` redefines the CSS variables (`--bg`, `--text`, …) under `.dark`, so CSS Modules switch automatically.
3. `@custom-variant dark (&:where(.dark, .dark *));` makes Tailwind's `dark:` utilities follow that class:
   ```jsx
   <div className="bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white">…</div>
   ```
4. [`components/theme-script.js`](https://github.com/aamshaegar/NextronJS-app-router/blob/main/renderer/components/theme-script.js) is inlined in each root layout's `<head>`. It applies the saved theme **before the first paint**, so there's no flash. The splash screen uses it too.

To change the colors, edit the `:root` (light) and `.dark` blocks in `globals.css`.

### Other options

- **Global CSS** (`styles/globals.css`) holds CSS variables (`--bg`, `--accent`, …). Import it only in root layouts.
- **CSS Modules** (`*.module.css`) are scoped per component: `import s from './x.module.css'`, then `className={s.card}`. They can be mixed freely with Tailwind.
- Static images go in `renderer/public/` and are referenced as `/images/x.png`.
