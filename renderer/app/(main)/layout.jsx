// Root layout for the normal app windows. Pages under (main)/ use it.
// Route groups like "(main)" don't appear in the URL.
import { ViewTransition } from 'react'
import Link from 'next/link'
import '../../styles/globals.css'
import s from '../../styles/app.module.css'

export const metadata = {
  title: { template: '%s · My Nextron App', default: 'My Nextron App' },
}

export default function MainLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className={s.shell}>
          <nav className={s.nav}>
            <Link href="/home">Home</Link>
            <Link href="/next">Next</Link>
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
