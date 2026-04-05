const CACHE_NAME = 'telecom-v1.2.2'; // Nouvelle version pour forcer la mise à jour
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './points.csv', // Indispensable pour vos points statiques
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    'https://cdnjs.cloudflare.com/ajax/libs/papaparse/5.4.1/papaparse.min.js', // Ajouté pour le CSV
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js'
];

self.addEventListener('install', e => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE_NAME).then(c => c.addAll(ASSETS))
    );
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(k => { if(k !== CACHE_NAME) return caches.delete(k); })
        ))
    );
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    e.respondWith(
        fetch(e.request)
            .then(res => {
                if (!res || res.status !== 200) return caches.match(e.request).then(doc => doc || res);
                return res;
            })
            .catch(() => caches.match(e.request))
    );
});
