/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. React Strict Mode: Production mein bugs pakadne ke liye behtar hai
  reactStrictMode: true,

  // 2. Compression: Gzip/Brotli compression enable karta hai (Page speed boost)
  compress: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
    // 3. Device Sizes: Responsive images ke liye optimal sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // 4. Formats: AVIF sab se chota size deta hai, Webp backup ke liye
    formats: ['image/avif', 'image/webp'],
    
    // 5. Cache Time: Images ko 1 saal tak cache mein rakhega (Fast loading)
    minimumCacheTTL: 31536000, 
  },
  
  // 6. Custom Headers: SEO aur Security ke liye premium setup
  async headers() {
    return [
      {
        // Assets Caching: Images aur fonts bar bar download nahi honge
        source: '/(.*).(svg|png|jpg|jpeg|webp|avif|ico|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Global Security Headers
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          }
        ],
      },
    ];
  },

  // 7. Compiler Settings: Production build optimize karne ke liye
  compiler: {
    // Production mein saare console.log() khud khatam ho jayenge
    removeConsole: process.env.NODE_ENV === 'production', 
  },

  // NOTE: swcMinify nikal diya gaya hai kyunki Next.js 13+ mein ye default hai.
};

export default nextConfig;