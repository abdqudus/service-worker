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

# 28/12/2023

- ###### Space is limited, so it won't be a good practice to store too much things on a user's browser.
- ###### For this reason, it is a good practice to always clean up the cache by removing relatively less requested resources.
- ###### Since the pattern followed in this tutorial is to always look in the cache, fetch a new version and then save the new version, relatively old files that are not requested for are always the first items in the caache array.
- ###### So, we can write a utility function to clean up the cache from time to time.
- ###### The best time to call this function is now the focus.
- ###### It shouldn't be called in the activate event, cos it only runs when a visitor first visits our webpage. SO if the person doesnt leave the webpage for long, the person might get a stale version.
- ###### Another option is when any fetch event is fired, but this can lead to complications if files are also stored in the cache when this event fires.
- ###### 

