import "./globals.css";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import AuthProvider from "../components/SessionProvider"; 
import { CartProvider } from "../context/CartContext";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import WhatsAppWrapper from "../components/ui/WhatsAppWrapper";
import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://ladynest.store'), 
  title: {
    default: "Women’s Handbags & Fashion Accessories Online in Pakistan – LadyNest",
    template: "%s | LadyNest"
  },
  description: "Buy trendy ladies handbags online in Pakistan at LadyNest. Explore our latest collection of stylish women bags, tote bags, clutches, and cross body bags designed for fashion and everyday use.",
  keywords: [
    "ladies handbags Pakistan", "women handbags Pakistan", "buy handbags online Pakistan", 
    "fashion accessories", "tote bags", "handbags", "clutches", "cross body bags", "ladynest"
  ],
  alternates: { canonical: '/' },
  verification: { google: "b01o9oD-lE4IeJfROvbEoPGTxcWKWkMOD_b1eDCOx2c" },
  openGraph: {
    title: "Women’s Handbags & Fashion Accessories Online in Pakistan – LadyNest",
    description: "Premium handcrafted PU Leather bags for the modern woman. Shop the best collection in Pakistan.",
    url: "https://ladynest.store", 
    siteName: "LadyNest",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: 'LadyNest Luxury Collection' }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LadyNest | Luxury PU Leather Bags",
    description: "Premium handcrafted PU Leather bags for women in Pakistan.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: '/favicon.ico', 
    apple: '/apple-touch-icon.png', 
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`scroll-smooth ${inter.variable} ${playfair.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#fafafa" />

        {/* TikTok Pixel Code - Placed between <head> tags as requested */}
        <Script id="tiktok-pixel" strategy="beforeInteractive">
          {`
            !function (w, d, t) {
              w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
              var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
              ;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

              ttq.load('D7ODPPBC77U471PH149G');
              ttq.page();
            }(window, document, 'ttq');
          `}
        </Script>

        {/* Structured Data (JSON-LD) for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              "name": "LadyNest",
              "url": "https://ladynest.store",
              "logo": "https://ladynest.store/logo.png",
              "description": "Premium handcrafted PU Leather bags in Pakistan.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "PK"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://ladynest.store/products?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }),
          }}
        />
      </head>
      <body className="bg-[#fafafa] text-[#111111] antialiased min-h-screen flex flex-col font-sans selection:bg-[#C5A25D] selection:text-white">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            
            <WhatsAppWrapper />
            <SpeedInsights />

            {/* FACEBOOK PIXEL */}
            <Script id="fb-pixel" strategy="lazyOnload">
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '13209851'); 
                fbq('track', 'PageView');
              `}
            </Script>

            {/* GOOGLE ANALYTICS */}
            <Script 
              src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX" 
              strategy="lazyOnload" 
            />
            <Script id="google-analytics" strategy="lazyOnload">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-XXXXXXXX');
              `}
            </Script>

            {/* Statcounter Code */}
            <Script id="statcounter-config" strategy="lazyOnload">
              {`
                var sc_project=13209851; 
                var sc_invisible=1; 
                var sc_security="db86c4a9"; 
              `}
            </Script>
            <Script 
              src="https://www.statcounter.com/counter/counter.js" 
              strategy="lazyOnload" 
            />
            
            <noscript>
              <div className="statcounter">
                <a title="free hit counter" href="https://statcounter.com/" target="_blank">
                  <img 
                    className="statcounter"
                    src="https://c.statcounter.com/13209851/0/db86c4a9/1/" 
                    alt="free hit counter"
                    referrerPolicy="no-referrer-when-downgrade" 
                  />
                </a>
              </div>
            </noscript>

          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}