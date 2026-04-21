const CACHE_NAME = 'ronika-tv-v4';
const STATIC_ASSETS = [
    './index.html',
    './manifest.json',
    'https://i.imgur.com/b3hX9Lw.jpg'
];

self.addEventListener('install', (e) => {
    // کش کردن فایل‌های اصلی برای لود فوق‌سریع
    e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)));
});

self.addEventListener('fetch', (e) => {
    // جلوگیری از کش شدن استریم‌های زنده (بسیار مهم برای IPTV)
    if (e.request.url.includes('.m3u8') || e.request.url.includes('.ts')) {
        return; 
    }
    // برای بقیه فایل‌ها: اول چک کن تو کش هست یا نه، اگه نبود دانلود کن
    e.respondWith(
        caches.match(e.request).then(res => res || fetch(e.request))
    );
});
