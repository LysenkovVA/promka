/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  reactStrictMode: false, // Чтобы не было 2 рендеров в dev режиме
}

export default nextConfig
