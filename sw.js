const cacheName = 'NowMemo-v1.0.0'
const cacheUrls = [
  './',
  'index.html',
  'index.js',
  'main.css',
  'LigatureSymbols.woff',
  'favicon.ico',
  'icon-192x192.png',
  'icon-512x512.png',
  'apple-touch-icon.png'
]

self.addEventListener('install', (ev) => {
  console.log('[Service Worker] installing...')
  ev.waitUntil((async () => {
    const cache = await caches.open(cacheName)
    console.log('[Service Worker] caching...')
    await cache.addAll(cacheUrls)
  })())
})

self.addEventListener('fetch', (ev) => {
  e.respondWith((async () => {
    const r = await cache.match(ev.request)
    console.log(`[Service Worker] Fetching resource : ${ev.request.url}`)
    if (r) return r
    const response = await fetch(ev.request)
    const cache = await caches.open(cacheName)
    console.log(`[Service Worker] Caching new resource : ${ev.request.url}`)
    cache.put(e.request, response.clone())
    return response
  })())
})
