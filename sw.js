const CACHE="atlas-v1";
const SHELL=["./","index.html","data.json.gz","manifest.webmanifest","icon-192.png","icon-512.png","icon-180.png","icon-32.png","logo.svg"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET") return;
  const url=new URL(e.request.url);
  if(url.origin===location.origin){
    if(url.pathname.endsWith("data.json.gz")){ e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))); return; }
    e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return r;}).catch(()=>caches.match(e.request).then(r=>r||caches.match("index.html"))));
  }else if(/fonts\.(googleapis|gstatic)\.com/.test(url.host)){
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return res;})));
  }
});