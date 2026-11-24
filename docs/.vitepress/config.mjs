import { defineConfig } from 'vitepress'

const repo = 'https://github.com/aamshaegar/NextronJS-app-router'

export default defineConfig({
  title: 'Next.js App Router Electron',
  description: 'Electron + Next.js 16 (App Router) desktop starter',
  // GitHub Pages serves the site at /<repo-name>/
  base: '/NextronJS-app-router/',
  cleanUrls: true,
  // localhost URLs in the docs are examples, not real links
  ignoreDeadLinks: [/^https?:\/\/localhost/],
  lastUpdated: true,
  head: [['link', { rel: 'icon', href: '/NextronJS-app-router/logo.png' }]],

  themeConfig: {
    logo: '/logo.png',
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Reference', link: '/reference/commands' },
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'Getting started', link: '/guide/getting-started' },
          { text: 'How it works', link: '/guide/how-it-works' },
        ],
      },
      {
        text: 'Guide',
        items: [
          { text: 'Creating pages', link: '/guide/pages' },
          { text: 'Layouts and route groups', link: '/guide/layouts' },
          { text: 'Server vs Client Components', link: '/guide/server-client' },
          { text: 'Talking to Electron (IPC)', link: '/guide/ipc' },
          { text: 'The splash screen', link: '/guide/splash-screen' },
          { text: 'Opening new windows', link: '/guide/windows' },
          { text: 'Styling, Tailwind and themes', link: '/guide/styling' },
          { text: 'Building and packaging', link: '/guide/building' },
          { text: 'Writing these docs', link: '/guide/documentation' },
        ],
      },
      {
        text: 'Reference',
        items: [
          { text: 'Commands', link: '/reference/commands' },
          { text: 'Project structure', link: '/reference/project-structure' },
          { text: 'Next.js 16 features', link: '/reference/nextjs-16' },
          { text: 'Rules and limitations', link: '/reference/rules' },
          { text: 'Troubleshooting', link: '/reference/troubleshooting' },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: repo }],
    editLink: { pattern: `${repo}/edit/main/docs/:path`, text: 'Edit this page on GitHub' },
    search: { provider: 'local' },
    outline: [2, 3],
    footer: { message: 'Released under the MIT License.', copyright: 'Copyright © 2026 aamshaegar' },
  },
})
