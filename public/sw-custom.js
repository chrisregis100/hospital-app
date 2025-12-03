// Service Worker personnalisé pour Lokita
// Gère le mode hors-ligne et les notifications push

const CACHE_NAME = "lokita-v1";
const OFFLINE_URL = "/offline";

// Fichiers à mettre en cache lors de l'installation
const STATIC_CACHE = [
  "/",
  "/offline",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

// Installation du service worker
self.addEventListener("install", (event) => {
  console.log("[SW] Installation...");

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Mise en cache des fichiers statiques");
      return cache.addAll(STATIC_CACHE);
    })
  );

  // Force le nouveau SW à devenir actif immédiatement
  self.skipWaiting();
});

// Activation du service worker
self.addEventListener("activate", (event) => {
  console.log("[SW] Activation...");

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("[SW] Suppression de l'ancien cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  // Prend le contrôle immédiatement
  self.clients.claim();
});

// Interception des requêtes
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-GET
  if (request.method !== "GET") {
    return;
  }

  // Ignorer les requêtes vers des domaines externes (sauf Google Fonts)
  if (url.origin !== location.origin && !url.hostname.includes("googleapis")) {
    return;
  }

  // Stratégie Network First pour les API
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({ error: "Pas de connexion Internet" }),
          {
            status: 503,
            headers: { "Content-Type": "application/json" },
          }
        );
      })
    );
    return;
  }

  // Stratégie Cache First pour les fichiers statiques
  if (
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|woff2?)$/)
  ) {
    event.respondWith(
      caches.match(request).then((response) => {
        return (
          response ||
          fetch(request).then((fetchResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, fetchResponse.clone());
              return fetchResponse;
            });
          })
        );
      })
    );
    return;
  }

  // Stratégie Network First avec fallback offline pour les pages
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Mettre en cache la réponse
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Chercher dans le cache
        return caches.match(request).then((response) => {
          return response || caches.match(OFFLINE_URL);
        });
      })
  );
});

// Gestion des notifications push
self.addEventListener("push", (event) => {
  console.log("[SW] Push reçu:", event);

  const data = event.data ? event.data.json() : {};
  const title = data.title || "Lokita";
  const options = {
    body: data.body || "Nouvelle notification",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/badge-72x72.png",
    tag: data.tag || "lokita-notification",
    data: data.data || {},
    requireInteraction: true,
    actions: [
      {
        action: "view",
        title: "Voir",
      },
      {
        action: "close",
        title: "Fermer",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Gestion des clics sur les notifications
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Clic sur notification:", event);

  event.notification.close();

  if (event.action === "view" || !event.action) {
    const urlToOpen = event.notification.data?.url || "/appointments";

    event.waitUntil(
      clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then((clientList) => {
          // Chercher une fenêtre déjà ouverte
          for (const client of clientList) {
            if (client.url === urlToOpen && "focus" in client) {
              return client.focus();
            }
          }
          // Ouvrir une nouvelle fenêtre
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});

// Synchronisation en arrière-plan (pour les futurs besoins)
self.addEventListener("sync", (event) => {
  console.log("[SW] Sync:", event.tag);

  if (event.tag === "sync-appointments") {
    event.waitUntil(
      // Synchroniser les rendez-vous avec le serveur
      fetch("/api/appointments/sync").catch((err) => {
        console.error("[SW] Erreur de sync:", err);
      })
    );
  }
});

console.log("[SW] Service Worker Lokita chargé");
