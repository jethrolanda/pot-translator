"use client";

import { useEffect } from "react";

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
  useEffect(() => {
    // Load Google AdSense script if adClient is provided
    if (adClient && typeof window !== "undefined") {
      const script = document.createElement("script");
      script.src =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
      script.async = true;
      script.setAttribute("data-ad-client", adClient);
      document.head.appendChild(script);

      // Initialize ads
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
          {}
        );
      } catch (e) {
        console.error("AdSense error:", e);
      }
    }
  }, [adClient]);

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
