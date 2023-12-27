# Serice workers Concepts I learnt today (26/12/2023)

##### Registration: A service worker has to be registered before use.

##### Scope: Where the service worker has influence on

##### Async Nature Of service worker: Since the browser has to check if the network is secure(HTTPS) or localhost and it also has to verify that the service worker is from the same domain as the website, service worker registraation is async

##### Service worker steps: Download-> install -> wait -> activate

##### Since the web is stateless, a user visiting a website for the hundredth time is no different from one visiting for the first time.

##### To mitigate this cookies was created.

##### The working principle of the cookies is the HTTP cache. Whenever a user visits a website, the server can send headers along with the file to instruct the browser HTTP cache what and whatnot to cache.

##### Most times, CSS, JS, images, fonts, and other resources that aren't frequently changed are cached.

##### However, the HTTP cache doesn't have enough storage as the browser provides only one HTTP Cache for every website visited on the browser.

##### For this reason, the Cache API was introduced.

##### Like the fetch API, the cache API is async in nature, and therefore, uses promises.

##### The Cache API is therefore perfect for usage in a service worker.

##### The Cache API allows us to

- create caches
- delete caches
- put files into caches
- retrieve files from caches

##### Where the HTTP cache gives us just one place to cache all resources, the cache API allows us to be creative in ways we organize our caches.

# 27/12/2023

###### I learnt the importance of strategizing when writing a service worker code.

###### Every service worker must be written to fit the requirement of the webpage.

###### In essence, there is no one shoe fits all
