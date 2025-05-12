/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/webp'], // Prefer WebP format when supported
    minimumCacheTTL: 315360000, // Cache optimized images for 10 years (effectively forever)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Responsive image sizes
    imageSizes: [16, 32, 48, 64, 80, 96, 128, 256], // Image sizes for srcset
    domains: [], // Add any external domains if needed
    dangerouslyAllowSVG: true, // Allow SVG files if needed
    contentDispositionType: 'attachment', // How image content should be served
  },
};

export default nextConfig;
