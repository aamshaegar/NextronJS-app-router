// Server Component (no 'use client'): rendered to static HTML at build time.
import { Panels } from './panels'

export const metadata = { title: 'Next' }

export default function NextPage() {
  return (
    <>
      <h1>Next page</h1>
      <p>This page is a Server Component, pre-rendered at build time.</p>
      <Panels />
    </>
  )
}
