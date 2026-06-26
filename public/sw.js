const CACHE_NAME = "vitaluxe-v1";
const STATIC_ASSETS = [
    "/",
    "/shop",
    "/manifest.json",
    "/VITALUXE.png",
];

// Install: cache static assets
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
    );
    self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// Fetch: Network first, fallback to cache
self.addEventListener("fetch", (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET, API calls, and auth routes
    if (
        request.method !== "GET" ||
        url.pathname.startsWith("/api/") ||
        url.pathname.startsWith("/admin") ||
        url.pathname.startsWith("/_next/")
    ) {
        return;
    }

    event.respondWith(
        fetch(request)
            .then((response) => {
                // Cache successful responses for HTML pages and images
                if (response.ok && (request.destination === "image" || request.destination === "document")) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                }
                return response;
            })
            .catch(() => caches.match(request).then((cached) => cached || caches.match("/")))
    );
});

// Push notifications (future use)
self.addEventListener("push", (event) => {
    if (!event.data) return;
    const data = event.data.json();
    self.registration.showNotification(data.title || "Vitaluxe", {
        body: data.body || "Vous avez une nouvelle notification.",
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-72x72.png",
        data: { url: data.url || "/" },
    });
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data?.url || "/")
    );
});
