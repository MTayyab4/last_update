//sw.js

const staticAssets = [

   "/", 

   "/index.html",
   "/style.css",
   "/script.js",

   "/404.html",

   "/offline.html", install service worker and cache static assets");

  event.waitUntil(

       caches

         .open(cacheName)

         .then((cache) => {

                   //Update version

                   increment();



                  //add files to the cache

                  return cache.addAll(staticAssets);

         })

         .catch((err) => console.log(err))

     );

});



self.addEventListener("activate", (event) => {

   console.log("Activating new service worker...");



   event.waitUntil(

        caches.keys().then((cacheNames) => {

               return Promise.all(

                        cacheNames.map((storedCacheName) => {

                                   if (storedCacheName !== cacheName) {

                                                return caches.delete(storedCacheName);

                                   }

                        })

                      );

        })

      );

});



self.addEventListener("fetch", (event) => {

   console.log("Fetch event for", event.request.url);



   event.respondWith(

        caches

          .match(event.request)

          .then((response) => {

                   //If the response is found in the cache

                   if (response) {

                              console.log("Found ", event.request.url, " in cache");

                              return response;

                   }



                            return fetch(event.request).then((response) => {

                                       // If a response is not found

                                       if (response.status === 404) {

                                                    return caches.open(cacheName).then((cache) => {

                                                                   return cache.match("404.html");

                                                    });

                                       }



                                                  //Caching and returning the response if it doesn't exist in the cache

                                                  return caches.open(cacheName).then((cache) => {

                                                               cache.put(event.request.url, response.clone());

                                                               return response;

                                                  });

                            });

          })

          .catch(async (error) => {

                   console.log("Error, ", error);

                   //If page is offline/ Network failure

                   return caches.open(cacheName).then((cache) => {

                              return cache.match("offline.html");

                   });

          })

      );

});

 ];

let cacheVersion = 0;

let cacheName = `cache-v${cacheVersion}`;

function increment() {

  cacheVersion ++;

  cacheName = `cache-v${cacheVersion}`;

}



//Add cache while installing Sw

self.addEventListener("install", (event) => {

                        console.log("Attempting to
