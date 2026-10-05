const CACHE_NAME = 'bousan-cache-v1';
const ASSETS_TO_CACHE = [
    './',                     // Racine du site
    './index.html',           // Page d'accueil
    './style.css',            // Design global
    './images/samri.jpeg',    // Votre photo d'auteur
    
    // AJOUTEZ ICI VOS AUTRES PAGES AU FUR ET À MESURE :
    './college/index.html',   
    './lycee/index.html',     
    './universite/index.html'
];


// Installation du Service Worker et mise en cache des fichiers de base
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Activation et nettoyage des anciens caches
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
        })
    );
});

// Stratégie réseau : Réseau en priorité, sinon Cache (pour économiser le forfait des élèves)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
