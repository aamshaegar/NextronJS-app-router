// A second ROOT layout, just for the splash window.
// Separate <html>/<body> so it can be transparent with rounded corners
// and doesn't load the app's nav.
import '../../styles/globals.css'

export const metadata = { title: 'Loading…' }

export default function SplashLayout({ children }) {
  return (
    <html lang="en" style={{ background: 'transparent' }}>
      <body style={{ background: 'transparent', overflow: 'hidden' }}>{children}</body>
    </html>
  )
}
