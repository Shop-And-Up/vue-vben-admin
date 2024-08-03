// https://widget-builder-prod-app-bookmarklet.pages.dev/button.ts

export const bookmarkletName = 'WB V2.91';
export const bookmarkletScript = `javascript: r();c();function c(){const t="__BOOKMARKLET_URL__/lib.umd.js?v=2.91",e=document.getElementsByTagName("script");for(var n=e.length;n--;)if(e[n].src==t)return;const o=document.createElement("script");o.src=t,document.body.appendChild(o)}function r(){const t=document.getElementsByTagName("wba-bookmarklet");for(var e=t.length;e--;)t[e].remove();let n=document.createElement("wba-bookmarklet");n.setAttribute("uuid","__WBA_SHOP_ID__"),document.body.appendChild(n)}`;
