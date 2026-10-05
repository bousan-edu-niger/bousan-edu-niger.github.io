const CACHE_NAME = 'bousan-cache-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css'
];

// Installation robuste : si un fichier secondaire échoue, l'application s'installe quand même
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            // We use a safe mapping to prevent install crashes on single asset failure
            return Promise.all(
                ASSETS_TO_CACHE.map(url => {
                    return cache.add(url).catch(err => {
                        console.warn('Fichier non crucial ignoré au démarrage :', url, err);
                    });
                })
            );
        }).then(() => self.skipWaiting())
    );
});

// Activation immédiate de l'infrastructure applicative
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Stratégie réseau en priorité, secours sur le cache hors-ligne instantané
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
