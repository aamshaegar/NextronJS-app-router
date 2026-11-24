// Resolves a renderer route to a URL that works in dev and in the packaged app.
// dev  -> http://localhost:<port>/<route>   (served by `next dev`)
// prod -> app://./<route>                    (static export served by electron-serve)
const isProd = process.env.NODE_ENV === 'production'

export const routeURL = (route) => {
  const clean = route.replace(/^\/+/, '')
  if (isProd) return `app://./${clean}`
  const port = process.argv[2]
  return `http://localhost:${port}/${clean}`
}
