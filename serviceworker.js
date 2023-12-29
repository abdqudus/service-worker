const version = "V0.06";
const staticCacheName = version + "staticfiles";
const imageCacheName = "images";
const pagesCacheName = "pages";

const cacheList = [staticCacheName, imageCacheName, pagesCacheName];

addEventListener("install", (installEvnt) => {
  skipWaiting();
  installEvnt.waitUntil(
    caches.open(staticCacheName).then((staticCache) => {
      return staticCache.addAll([
        "./index.js",
        "./style.css",
        "./offline.html",
        "./upload.png",
      ]);
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
          cacheNames.map((cacheName) => {
            if (!cacheList.includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        clients.claim();
      })
  );
});
// You can model your fetch event listener anyhow you want depending on the nature of your webpage
// The midel here is that of a website that frequently changes it web content but rarely changes images
addEventListener("fetch", (fetchEvt) => {
  const req = fetchEvt.request;
  if (req.headers.get("Accept").includes("text/html")) {
    // if the requested file is an HTML file"
    fetchEvt.respondWith(
      fetch(req) //fetch from server or do whatever you always do
        .then((resFromFetch) => {
          const copy = resFromFetch.clone();
          fetchEvt.waitUntil(
            caches.open(pagesCacheName).then((pagesCache) => {
              return pagesCache.put(req, copy);
            })
          );
          return resFromFetch;
        })
        .catch((err) => {
          return caches
            .match(req) //check if page is in cache
            .then((resFromCache) => {
              if (resFromCache) {
                return resFromCache;
              }
              // If the file is not found in cache, return the default offline page
              return caches.match("./offline.html");
            });
        })
    );
    return;
  }
  if (req.headers.get("Accept").includes("image")) {
    // If requested file is an image
    fetchEvt.respondWith(
      caches
        .match(req) //Find in cache
        .then((resFromCache) => {
          if (resFromCache) {
            // If found
            fetchEvt.waitUntil(
              // fetch a new version of the image
              stashInCache(req, imageCacheName)
            );
            // return the previously saved image in the cache(The image that was found
            //  before fetching another one)
            return resFromCache;
          }
          //   If not do a network fetch
          return fetch(req) //hello world
            .then((resFromFetch) => {
              // since response can only be used once, saving the response
              //  in the cache means the user won't get the image if you cache first
              // Also, the cache would not be possible if response is first sent to user.
              const copy = resFromFetch.clone();
              // For this reason, you clone the response
              fetchEvt.waitUntil(
                // To prevent unwanted issues, you can wait to cache the copy b4 sending the original to the user
                caches
                  .open(imageCacheName)
                  .then((imgCache) => imgCache.put(req, copy))
              );
              return resFromFetch;
              // Return response to user
            })
            .catch((err) => caches.match("./upload.png"));
        })
    );
    return;
  }
  fetchEvt.respondWith(
    // FOr every other requests, follow the logic below
    caches.match(req).then((cacheRes) => {
      if (cacheRes) {
        return cacheRes;
      }
      return fetch(req);
      //   If nothing is found in the cache, make a network request like you normally do
    })
  );
});

function trimCache(cacheName, maxItems) {
  caches.open(cacheName).then((cache) => {
    cache.keys().then((items) => {
      if (items.length > maxItems) {
        cache
          .delete(items[0]) //Delete the first item (The oldest item in the array)
          .then(trimCache(cacheName, maxItems)); //Call the trim cache recursively until the base case is reached
      }
    });
  });
}
addEventListener("message", (msgEvt) => {
  if (msgEvt.data === "clean up caches") {
    trimCache(imageCacheName, 50);
  }
});

async function stashInCache(request, cacheName) {
  const responseFromFetch = await fetch(request);
  const theCache = await caches.open(cacheName);
  return await theCache.put(request, responseFromFetch);
}
