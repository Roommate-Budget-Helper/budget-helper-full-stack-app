if(!self.define){let e,s={};const n=(n,a)=>(n=new URL(n+".js",a).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(a,i)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let t={};const r=e=>n(e,c),o={module:{uri:c},exports:t,require:r};s[c]=Promise.all(a.map((e=>o[e]||r(e)))).then((e=>(i(...e),t)))}}define(["./workbox-588899ac"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/chunks/345-cd28d2e272ec9521.js",revision:"cd28d2e272ec9521"},{url:"/_next/static/chunks/425-133413ae444cbdb1.js",revision:"133413ae444cbdb1"},{url:"/_next/static/chunks/818-6091b4ec27d32a8b.js",revision:"6091b4ec27d32a8b"},{url:"/_next/static/chunks/959-663b9a7cb3179b48.js",revision:"663b9a7cb3179b48"},{url:"/_next/static/chunks/b2e984c5-dd2f7dc30ee2ed87.js",revision:"dd2f7dc30ee2ed87"},{url:"/_next/static/chunks/ee8b1517-76880c97b408b978.js",revision:"76880c97b408b978"},{url:"/_next/static/chunks/framework-7751730b10fa0f74.js",revision:"7751730b10fa0f74"},{url:"/_next/static/chunks/main-fa58607c7466e1f2.js",revision:"fa58607c7466e1f2"},{url:"/_next/static/chunks/pages/_app-3caaae7b1d43a0c0.js",revision:"3caaae7b1d43a0c0"},{url:"/_next/static/chunks/pages/_error-e4f561a102d9bb14.js",revision:"e4f561a102d9bb14"},{url:"/_next/static/chunks/pages/billing-03a75ec07551b6dd.js",revision:"03a75ec07551b6dd"},{url:"/_next/static/chunks/pages/createcharge-18b618f5c6c9ec61.js",revision:"18b618f5c6c9ec61"},{url:"/_next/static/chunks/pages/createhome-fa16004f2aa69597.js",revision:"fa16004f2aa69597"},{url:"/_next/static/chunks/pages/forgot_password-e7fa974a107be1be.js",revision:"e7fa974a107be1be"},{url:"/_next/static/chunks/pages/history-57b4505b57388f58.js",revision:"57b4505b57388f58"},{url:"/_next/static/chunks/pages/homes-89dd73bd3d9d51f7.js",revision:"89dd73bd3d9d51f7"},{url:"/_next/static/chunks/pages/index-480e2af096aff97a.js",revision:"480e2af096aff97a"},{url:"/_next/static/chunks/pages/login-99471f5d1a33c961.js",revision:"99471f5d1a33c961"},{url:"/_next/static/chunks/pages/notifications-2f5a05d9e2e02c74.js",revision:"2f5a05d9e2e02c74"},{url:"/_next/static/chunks/pages/register-8b20ee3cb82a685a.js",revision:"8b20ee3cb82a685a"},{url:"/_next/static/chunks/pages/updatehome-9436ed5e77aa5884.js",revision:"9436ed5e77aa5884"},{url:"/_next/static/chunks/pages/user-f25be66247186714.js",revision:"f25be66247186714"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-ee7e63bc15b31913.js",revision:"ee7e63bc15b31913"},{url:"/_next/static/css/5d05e7ae65674d50.css",revision:"5d05e7ae65674d50"},{url:"/_next/static/q4JyqwpsQAQZryCdzRYYC/_buildManifest.js",revision:"fe2ff3ec1751efd2aaf9c2912ec36154"},{url:"/_next/static/q4JyqwpsQAQZryCdzRYYC/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/android-chrome-192x192.png",revision:"0aa2910d025687d7183a9aa0b4eb1213"},{url:"/android-chrome-512x512.png",revision:"e7ad832888396d181efe760642983835"},{url:"/apple-touch-icon.png",revision:"5f4ab434db21977fe319cdfc6fa964f2"},{url:"/favicon-16x16.png",revision:"44a31fbb42e2587a5ca617c66f3baba5"},{url:"/favicon-32x32.png",revision:"0b235b9de9241e2dfede2303848b01ec"},{url:"/favicon.ico",revision:"5a0bdeae4e3400e5a6b0efd3e0b88cd5"},{url:"/icon-192x192.png",revision:"ce052157df7159466049812856862d77"},{url:"/icon-256x256.png",revision:"2685662ea24a58ee353ccd4cb502386c"},{url:"/icon-384x384.png",revision:"3696d6614a57710b41ff232bebb39406"},{url:"/icon-512x512.png",revision:"fbcfd6f21bd6eaeb962d2540dbf8d75d"},{url:"/images/formobileandpc.png",revision:"7b0352c9f607e1f2ddb9473b4fd0bff6"},{url:"/images/logo.png",revision:"44b9511370c79221a5f3051da3b7ab84"},{url:"/manifest.json",revision:"c195430aad053c9d1f2e7d4eb90c8345"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:n,state:a})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
