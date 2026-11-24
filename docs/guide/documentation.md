# Writing these docs

This site is built with [VitePress](https://vitepress.dev) from the Markdown files in `docs/`.

## Run it locally

```bash
npm run docs:dev       # live preview at http://localhost:5173/NextronJS-app-router/
npm run docs:build     # static site in docs/.vitepress/dist
npm run docs:preview   # preview the built site
```

## Add a page

1. Create a Markdown file, for example `docs/guide/database.md`:
   ```md
   # Using a database

   Some text…
   ```
2. Add it to the sidebar in `docs/.vitepress/config.mjs`:
   ```js
   { text: 'Using a database', link: '/guide/database' },
   ```
3. Link to it from other pages with `[database](/guide/database)`.

## Structure

The docs follow the [Diátaxis](https://diataxis.fr) model:

| Section | Purpose | Folder |
|---|---|---|
| **Guide** | Tutorials and how-to guides: doing things step by step | `docs/guide/` |
| **Reference** | Exact facts: commands, files, options | `docs/reference/` |

## Publishing

The `.github/workflows/docs.yml` workflow builds the site and publishes it to GitHub Pages on every push to `main` that changes `docs/`.

One-time setup: in the GitHub repo, go to **Settings → Pages → Build and deployment → Source**, and pick **GitHub Actions**.

The site is then available at **https://aamshaegar.github.io/NextronJS-app-router/**.
