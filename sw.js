const CACHE="zeroesvtapes-v5";
const ASSETS=["./","./index.html","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png","./icons/maskable-512.png","./icons/apple-touch-icon.png"];
/* cache:"reload" skips the browser's own HTTP cache, so a fresh install never saves an old copy of the files */
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(ASSETS.map(u=>fetch(new Request(u,{cache:"reload"})).then(r=>{if(!r.ok)throw new Error(u);return c.put(u,r)})))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
 const r=e.request;
 if(r.method!=="GET"||new URL(r.url).origin!==location.origin)return;
 /* Pages: ask the server first (always revalidated), use the saved copy only when offline */
 if(r.mode==="navigate"){
  e.respondWith(fetch(r,{cache:"no-cache"}).then(res=>{
   if(res&&res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put("./index.html",cp))}
   return res}).catch(()=>caches.match("./index.html",{ignoreSearch:true})));
  return;
 }
 /* Everything else: cache first, then network */
 e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{
  if(res&&res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp))}
  return res}).catch(()=>undefined)));
});
