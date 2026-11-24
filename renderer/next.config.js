/** @type {import('next').NextConfig} */
export default {
  // Electron loads static files -> must be a static export (required by nextron).
  output: 'export',
  distDir: process.env.NODE_ENV === 'production' ? '../app' : '.next',
  trailingSlash: true,
  images: {
    unoptimized: true, // no image server inside Electron
  },

  // Next 16: React Compiler is stable. Auto-memoizes components,
  // so you rarely need useMemo / useCallback / React.memo by hand.
  reactCompiler: true,

  // Next 16: Turbopack is the default bundler for dev AND build (nothing to set).
  // Its filesystem cache makes restarts of `npm run dev` much faster.
}
