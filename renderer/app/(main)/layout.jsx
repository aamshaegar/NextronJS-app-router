// Root layout for the normal app windows. Pages under (main)/ use it.
// Route groups like "(main)" don't appear in the URL.
import { ViewTransition } from 'react'
import Link from 'next/link'
import '../../styles/globals.css'
import s from '../../styles/app.module.css'
import { ThemeToggle } from '../../components/theme-toggle'
import { themeScript } from '../../components/theme-script'

export const metadata = {
  title: { template: '%s · My Nextron App', default: 'My Nextron App' },
}

export default function MainLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* apply saved theme before paint to avoid a flash */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <div className={s.shell}>
          <nav className={s.nav}>
            <Link href="/">Home</Link>
            <Link href="/next">Next</Link>
            <ThemeToggle />
          </nav>
          {/* Every route change cross-fades (see globals.css) */}
          <ViewTransition name="page">
            <main className={s.content}>{children}</main>
          </ViewTransition>
        </div>
      </body>
    </html>
  )
}
