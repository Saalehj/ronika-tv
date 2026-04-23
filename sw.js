// اسم کش رو عوض کردیم تا کش‌های قبلی رو دور بریزه
const CACHE_NAME = 'ronika-smart-v1';
const assets = ['./', './index.html', './AppLogo.jpg', './manifest.json'];

// نصب فوری
self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(assets)));
});

// پاک کردن هوشمند کش‌های قدیمی (Cache Busting)
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

// استراتژی Network-First (همیشه آخرین آپدیت رو نشون می‌ده)
self.addEventListener('fetch', (e) => {
    // از کش کردن ویدیوها جلوگیری کن تا حافظه گوشی پر نشه
    if (e.request.url.includes('.m3u8') || e.request.url.includes('.ts')) return;

    e.respondWith(
        fetch(e.request).then(response => {
            // اگر به اینترنت وصل بودیم، فایل جدید رو بگیر و تو کش هم ذخیره کن
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
            return response;
        }).catch(() => {
            // اگر آفلاین بودیم یا اینترنت قطع بود، نسخه ذخیره شده رو بیار
            return caches.match(e.request);
        })
    );
});
