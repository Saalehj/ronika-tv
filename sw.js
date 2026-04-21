const CACHE_NAME = 'ronika-tv-v1';

// وقتی اپلیکیشن نصب میشه، این فایل‌ها تو حافظه گوشی ذخیره میشن
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([
                './',
                './index.html',
                './manifest.json',
                './AppLogo.jpg'
            ]);
        })
    );
});

// این بخش به گوشی میگه که این یه اپلیکیشن واقعیه
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            return response || fetch(e.request);
        })
    );
});
