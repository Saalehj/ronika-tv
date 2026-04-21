const CACHE_NAME = 'ronika-v6';
const assets = ['./index.html', './manifest.json', './AppLogo.jpg'];

self.addEventListener('install', (e) => {
    // نصب فوری بدون معطلی
    self.skipWaiting();
    
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            // ترفند هوشمند: تلاش برای دانلود فایل‌ها، اما اگر یکی خراب بود، کل نصب متوقف نشه!
            return Promise.allSettled(assets.map(url => cache.add(url)));
        })
    );
});

self.addEventListener('fetch', (e) => {
    // به هیچ وجه استریم‌های ویدیو رو کش نکن تا مرورگر هنگ نکنه
    if (e.request.url.includes('.m3u8') || e.request.url.includes('.ts')) return;
    
    e.respondWith(
        caches.match(e.request).then(res => res || fetch(e.request))
    );
});
