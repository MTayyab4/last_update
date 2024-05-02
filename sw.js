const staticAssets = ["/", "/index.html", "/404.html", "/offline.html"];
let cacheVersion =2;
let cacheName = cache-v2;

//function increment() {
 // cacheVersion++;
  //cacheName = cache-v${cacheVersion};
//}

// Add cache while installing Sw
self.addEventListener("install", (event) => {
  console.log("Attempting to install service worker and cache static assets");
  event.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        increment(); // Update version
        return cache.addAll(staticAssets);
      })
      .catch((err) => console.log(err))
  );
});

self.addEventListener("activate", (event) => {
  console.log("Activating new service worker...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((storedCacheName) => {
          if (storedCacheName !== cacheName) {
            return caches.delete(storedCacheName);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  console.log("Fetch event for", event.request.url);
  const url = new URL(event.request.url);
  const cacheFirst = url.hostname === '(https://mtayyab4.github.io/last_update/)'; // Cache first for specific domain
  const networkFirst = url.pathname === '/api/data'; // Network first for specific API endpoint

  event.respondWith(
    (async () => {
      try {
        // Cache First Strategy
        if (cacheFirst) {
          const cachedResponse = await caches.open(cacheName).then((cache) => cache.match(event.request));
          if (cachedResponse) {
            console.log("Found in cache", event.request.url);
            return cachedResponse;
          }
        }

        // Network First Strategy
        if (networkFirst) {
          const networkResponse = await fetch(event.request);
          if (networkResponse.ok) {
            console.log("Fetched from network", event.request.url);
            return networkResponse;
          }
        }

        // Cache and Network Race
        const [cachedResponse, networkResponse] = await Promise.all([
          caches.open(cacheName).then((cache) => cache.match(event.request)),
          fetch(event.request),
        ]);

        if (cachedResponse && cachedResponse.ok) {
          console.log("Found in cache", event.request.url);
          return cachedResponse;
        } else if (networkResponse && networkResponse.ok) {
          console.log("Fetched from network", event.request.url);
          return networkResponse;
        }
      } catch (error) {
        console.log("Error", error);
        // Return offline page for specific URLs
        if (url.pathname === '/index.html') {
          return caches.open(cacheName).then((cache) => cache.match("offline.html"));
        }
      }
    })()
  );
});
