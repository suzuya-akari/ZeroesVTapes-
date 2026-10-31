const CACHE="zeroesvtapes-v3";
const ASSETS=["./","./index.html","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png","./icons/maskable-512.png","./icons/apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
 const r=e.request;
 if(r.method!=="GET"||new URL(r.url).origin!==location.origin)return;
 /* Pages: network first (so updates show up), cache as the offline fallback */
 if(r.mode==="navigate"){
  e.respondWith(fetch(r).then(res=>{
   if(res&&res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put("./index.html",cp))}
   return res}).catch(()=>caches.match("./index.html",{ignoreSearch:true})));
  return;
 }
 /* Everything else: cache first, then network */
 e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{
  if(res&&res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp))}
  return res}).catch(()=>undefined)));
});
