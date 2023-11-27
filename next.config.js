const withPWA = require('next-pwa')({
  dest: 'public',
});

module.exports = withPWA({
  images: {
    domains: ['oaidalleapiprodscus.blob.core.windows.net', 'ava-academy.s3.eu-north-1.amazonaws.com', 'static.vecteezy.com'],
  },
  // Your other Next.js configuration options
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // replace this with your actual origin
          { key: "Access-Control-Allow-Methods", value: "GET, DELETE, PATCH, POST, PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ],
      },
    ];
  },
});

