"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    Tawk_API?: Record<string, unknown>;
  }
}

export function LiveChat() {
  useEffect(() => {
    const src = process.env.NEXT_PUBLIC_TAWK_SRC;
    if (!src) {
      return;
    }

    if (document.querySelector('script[data-chat="tawk"]')) {
      return;
    }

    window.Tawk_API = window.Tawk_API || {};

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.setAttribute("data-chat", "tawk");
    document.body.appendChild(script);
  }, []);

  return null;
}
