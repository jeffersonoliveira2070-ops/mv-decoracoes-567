import { useEffect, useRef } from "react";
import { useRouter } from "@tanstack/react-router";
import { getGaMeasurementId } from "../lib/analytics.functions";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Carrega o gtag.js do Google Analytics uma única vez e envia
 * page_view a cada troca de rota (SPA).
 */
export function GoogleAnalytics() {
  const router = useRouter();
  const measurementIdRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getGaMeasurementId().then((id) => {
      if (cancelled || !id) return;
      measurementIdRef.current = id;

      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer ?? [];
      window.gtag = function gtag(...args: unknown[]) {
        window.dataLayer!.push(args);
      };
      window.gtag("js", new Date());
      window.gtag("config", id);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Envia page_view em cada navegação client-side
  useEffect(() => {
    const unsubscribe = router.subscribe("onResolved", ({ toLocation }) => {
      const id = measurementIdRef.current;
      if (!id || !window.gtag) return;
      window.gtag("event", "page_view", {
        page_path: toLocation.pathname + toLocation.searchStr,
      });
    });
    return unsubscribe;
  }, [router]);

  return null;
}
