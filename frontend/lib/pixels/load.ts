let loaded = false;

function injectScript(src: string): void {
  const script = document.createElement("script");
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

export function loadPixelsDeferred(): void {
  if (typeof window === "undefined" || loaded) return;
  loaded = true;

  const loadAll = () => {
    const metaId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
    const tiktokId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
    const snapId = process.env.NEXT_PUBLIC_SNAPCHAT_PIXEL_ID;

    if (metaId) injectScript(`https://connect.facebook.net/en_US/fbevents.js`);
    if (tiktokId) injectScript(`https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${tiktokId}`);
    if (snapId) injectScript("https://sc-static.net/scevent.min.js");
  };

  window.addEventListener("load", () => {
    window.setTimeout(loadAll, 1500);
  });
}
