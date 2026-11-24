// Server Component (no 'use client'): rendered to static HTML at build time.
import { Panels } from './panels'

export const metadata = { title: 'Next' }

export default function NextPage() {
  return (
    <>
      <h1 className="mb-2 text-2xl font-semibold">Next page</h1>
      <p>This page is a Server Component, pre-rendered at build time.</p>
      <Panels />
    </>
  )
}
