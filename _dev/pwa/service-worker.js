(function() {
  'use strict';

  var filesToCache = [
    '.',
    'assets/js/the-architect-all.min.js',
    'assets/images/architecture/557A0409.jpg',
    'assets/images/architecture/557A0410.jpg',
    'assets/images/architecture/557A0504.jpg',
    'assets/images/architecture/557A0975.jpg',
    'assets/images/architecture/557A1017.jpg',
    'assets/images/architecture/557A1031.jpg',
    'assets/images/architecture/557A1048.jpg',
    'assets/images/architecture/557A1101.jpg',
    'assets/images/architecture/557A1110.jpg',
    'assets/images/architecture/557A8640.jpg',
    'assets/images/architecture/china_art_museum.jpg',
    'assets/images/architecture/IMG_1890.jpg',
    'index.html',
    'offline.html',
    '404.html'
  ];

  var staticCacheName = 'pages-cache-v1';

  self.addEventListener('install', function(event) {
    console.log('Attempting to install service worker and cache static assets');
    event.waitUntil(
      caches.open(staticCacheName)
      .then(function(cache) {
        return cache.addAll(filesToCache);
      })
    );
  });

  self.addEventListener('fetch', function(event) {
    console.log('Fetch event for ', event.request.url);
    event.respondWith(
      caches.match(event.request).then(function(response) {
        if (response) {
          console.log('Found ', event.request.url, ' in cache');
          return response;
        }
        console.log('Network request for ', event.request.url);
        return fetch(event.request).then(function(response) {
          if (response.status === 404) {
            return caches.match('404.html');
          }
          return caches.open(staticCacheName).then(function(cache) {
            if (event.request.url.indexOf('test') < 0) {
              cache.put(event.request.url, response.clone());
            }
            return response;
          });
        });
      }).catch(function(error) {
        return caches.match('offline.html');
      })
    );
  });

  // TODO 7 - delete unused caches

})();