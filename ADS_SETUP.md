# Ad Monetization Setup Guide

This application includes ad placements in strategic locations to help monetize your site. Follow this guide to set up your ads.

## Ad Placement Locations

The application has ads placed in the following locations:

1. **Top Banner Ad** - Below the header, before the contact form
   - Full-width banner
   - High visibility
   - Slot: `top-banner`

2. **Sidebar Ad** - Right side when viewing translations
   - Sticky sidebar (stays visible while scrolling)
   - Only shows when a POT file is loaded
   - Slot: `sidebar`
   - Size: 300x250 (recommended)

3. **In-Content Ad** - Between main content and info section
   - Full-width banner
   - Slot: `in-content`

4. **Footer Ad** - At the bottom of the page
   - Full-width banner
   - Slot: `footer`

## Setting Up Google AdSense

### Step 1: Get Your AdSense Account
1. Sign up at [Google AdSense](https://www.google.com/adsense/)
2. Get approved for your website
3. Get your Publisher ID (format: `ca-pub-XXXXXXXXXXXXXXXX`)

### Step 2: Create Ad Units
1. Go to AdSense dashboard → Ads → By ad unit
2. Create ad units for each placement:
   - Top Banner: Responsive display ad
   - Sidebar: Display ad (300x250)
   - In-Content: Responsive display ad
   - Footer: Responsive display ad
3. Note down the Ad Slot IDs for each unit

### Step 3: Configure the AdBanner Component

Edit `src/components/AdBanner.tsx` and update the component calls in `src/app/page.tsx`:

```tsx
// Example for Top Banner
<AdBanner 
  slot="top-banner" 
  className="w-full"
  style={{ minHeight: '100px' }}
  adClient="ca-pub-XXXXXXXXXXXXXXXX"  // Your AdSense Publisher ID
  adSlot="1234567890"                   // Your Ad Slot ID
  adFormat="auto"
/>
```

### Step 4: Add AdSense Script to Layout (Optional)

If you want to load AdSense globally, add this to `src/app/layout.tsx`:

```tsx
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
```

## Using Other Ad Networks

### Media.net
Replace the AdBanner content with Media.net code:

```tsx
<div className="ad-container">
  <div id="media-net-ad" data-ad-client="YOUR_MEDIA_NET_ID"></div>
  <script>
    (function() {
      var script = document.createElement('script');
      script.src = '//contextual.media.net/dmed.js?cid=YOUR_MEDIA_NET_ID';
      script.async = true;
      document.head.appendChild(script);
    })();
  </script>
</div>
```

### Ezoic
Add Ezoic code directly in the AdBanner component:

```tsx
<div className="ezoic-ad" data-ez-id="YOUR_EZOIC_ID"></div>
```

### Custom Ad Code
You can replace the placeholder content in `AdBanner.tsx` with any custom ad code from your preferred ad network.

## Ad Placement Best Practices

1. **Don't Overload**: The current setup has 4 ad placements which is reasonable. Don't add too many more.

2. **Mobile Responsive**: All ads are responsive and will adapt to mobile screens.

3. **User Experience**: Ads are placed to not interfere with the main functionality:
   - Top banner doesn't block content
   - Sidebar only shows when relevant (file loaded)
   - In-content ad is between sections, not interrupting workflow

4. **Ad Blockers**: Be aware that many users have ad blockers. Consider:
   - Showing a message asking users to disable ad blockers
   - Offering a premium ad-free version
   - Using native ads that are harder to block

## Testing Ads

1. **Development**: Ads won't show in development mode for Google AdSense. Test in production.

2. **AdSense Policy**: Make sure your site complies with AdSense policies:
   - Original, valuable content
   - Clear navigation
   - Privacy policy
   - Terms of service

3. **Performance**: Monitor ad performance in your ad network dashboard:
   - Click-through rate (CTR)
   - Revenue per thousand impressions (RPM)
   - User engagement

## Troubleshooting

### Ads Not Showing
- Check that ad code is correctly configured
- Verify your AdSense account is approved
- Check browser console for errors
- Ensure ad blockers are disabled

### Ads Breaking Layout
- Adjust `minHeight` in the `style` prop
- Check responsive breakpoints
- Test on different screen sizes

### Low Revenue
- Experiment with ad placement
- Try different ad sizes
- Consider A/B testing different positions
- Ensure good content quality

## Current Configuration

The ads are currently showing placeholders. To activate real ads:

1. Get your ad network credentials
2. Update `AdBanner` component calls in `src/app/page.tsx`
3. Replace placeholder content with real ad code
4. Test in production environment

Good luck with monetization! 🚀
