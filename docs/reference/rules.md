# Rules and limitations

1. `output: 'export'` and `distDir: '../app'` are **required** by nextron. Don't remove them.
2. Every route must be static at build time. Dynamic routes need `generateStaticParams`.
3. Anything that uses `window`, `window.ipc` or hooks needs `'use client'`.
4. Keep Node and OS work in `main/`. The renderer is just a web page.
5. The same URL can't be defined in two route groups.
6. Images use `unoptimized: true`, because there's no image server.
