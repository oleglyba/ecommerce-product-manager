const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        domains: ['dummyimage.com', 'cdn.dummyjson.com', 'i.dummyjson.com'],
        unoptimized: true
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'https://dummyjson.com/:path*'
            }
        ]
    },
    trailingSlash: true

}
