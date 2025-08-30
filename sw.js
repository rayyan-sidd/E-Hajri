// This is the Service Worker file for PWA offline functionality.
// It must be in the root directory of your project, named sw.js.

const CACHE_NAME = "attendance-app-cache-v1";
// This list includes all the files your app needs to work offline.
const urlsToCache = [
  "/",
  "attendance_app.html",
  "https://cdn.jsdelivr.net/npm/dexie@3.2.2/dist/dexie.min.js",
  "https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js",
  // We also need to cache the AI models.
  "/models/tiny_face_detector_model-weights_manifest.json",
  "/models/tiny_face_detector_model-shard1",
  "/models/face_landmark_68_net_model-weights_manifest.json",
  "/models/face_landmark_68_net_model-shard1",
  "/models/face_recognition_net_model-weights_manifest.json",
  "/models/face_recognition_net_model-shard1",
  // Add other model files if they are split into more shards
];

// Event: install
// This is triggered when the service worker is first installed.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Event: fetch
// This is triggered every time the app requests a resource (like a file or data).
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // If we find a match in the cache, we return it.
      if (response) {
        return response;
      }
      // Otherwise, we fetch it from the network.
      return fetch(event.request);
    })
  );
});

// Event: activate
// This is triggered when the service worker is activated.
// It's a good place to clean up old caches.
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
