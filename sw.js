const CACHE = "bek-mebel-v2";
const ASSETS = [
  "/",
  "/index.html",
  "/styles.css",
  "/script.js",
  "/assets/bek-mebel-logo.webp",
  "/_headers",
  "/robots.txt",
  "/sitemap.xml"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  event.respondWith(
    caches.open(CACHE).then((cache) =>
      cache.match(request).then((cached) => {
        const fetched = fetch(request).then((response) => {
          if (response.ok && response.type === "basic") {
            cache.put(request, response.clone());
          }
          return response;
        });
        return cached || fetched;
      })
    )
  );
});
