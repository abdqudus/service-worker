const version = "V0.01";
const staticCacheName = version + "staticfiles";

addEventListener("install", (installEvnt) => {
  skipWaiting();
  installEvnt.waitUntil(
    caches.open(staticCacheName).then((staticCache) => {
      return staticCache.addAll(["./index.js", "./style.css"]);
      //  NB: WHen there are too much files to cache, the browser
      // might not cache anything, so you can divide tje operation in two
      // the must cache and nice to cache.
      //   For the must cache use `return staticCache.addAll()' the return is the most important.
      // For good to have caches, you can just use staticCache.addAll without the return keyword
    })
  );
});
addEventListener("activate", (activateEvnt) => {
  activateEvnt.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cachename) => {
            if (cachename !== staticCacheName) {
              return caches.delete(cachename);
            }
          })
        );
      })
      .then(() => {
        clients.claim();
      })
  );
});
addEventListener("fetch", (fetchEvt) => {
  const req = fetchEvt.request;
  fetchEvt.respondWith(
    caches.match(req).then((cacheRes) => {
      if (cacheRes !== null) {
        // We dd this check cos a cache return null when no item matches the request
        return cacheRes;
      }
      return fetch(req);
      //   If nothing is found in the cache, make a network request like you normally do
    })
  );
});
