"use client";
import { useEffect, useRef, useState } from "react";

interface AdBannerProps {
  slot?: string;
  style?: React.CSSProperties;
  className?: string;
  adClient?: string;
  adSlot?: string;
  adFormat?: "auto" | "rectangle" | "horizontal" | "vertical";
  size?: string;
}

export default function AdBanner({
  slot,
  style,
  className = "",
  adClient,
  adSlot,
  adFormat = "auto",
  size
}: AdBannerProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const adPushed = useRef(false);

  // Load the AdSense script once
  useEffect(() => {
    if (!adClient || typeof window === "undefined") return;

    // Check if script already exists
    const existingScript = document.querySelector(
      `script[data-ad-client="${adClient}"]`
    );

    if (existingScript) {
      setScriptLoaded(true);
      return;
    }

    // Create and load script
    const script = document.createElement("script");
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-ad-client", adClient);

    script.onload = () => {
      setScriptLoaded(true);
    };

    script.onerror = () => {
      console.error("Failed to load AdSense script");
    };

    document.head.appendChild(script);

    // Cleanup function
    return () => {
      // Don't remove script on unmount as it's shared across components
    };
  }, [adClient]);

  // Push to adsbygoogle after script loads
  useEffect(() => {
    if (scriptLoaded && !adPushed.current && typeof window !== "undefined") {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
          {}
        );
        adPushed.current = true;
      } catch (e) {
        console.error("AdSense error:", e);
      }
    }
  }, [scriptLoaded]);

  // If adClient is provided, render Google AdSense ad
  if (adClient && adSlot) {
    return (
      <div
        className={`ad-container ${className}`}
        style={{ minHeight: "90px", ...style }}
      >
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={adClient}
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Placeholder for when no ad code is configured
  return (
    <div
      className={`ad-container flex items-center justify-center bg-gray-100 border border-gray-200 rounded-lg ${className}`}
      style={{ minHeight: "90px", ...style }}
    >
      <div className="text-center p-4 text-gray-500 text-sm">
        <div className="mb-2">📢 Advertisement</div>
        <div className="bg-white p-8 rounded border-2 border-dashed border-gray-300">
          <p className="text-gray-400 mb-2">Ad Space</p>
          <p className="text-xs text-gray-300">
            Configure your ad code in AdBanner component
          </p>
          <p className="text-xs text-gray-300 mt-1">
            Supports Google AdSense, Media.net, and other ad networks
          </p>
        </div>
      </div>
    </div>
  );
}
