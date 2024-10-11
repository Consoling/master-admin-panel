module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "master-admin-panel-next.s3.amazonaws.com",
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply these headers to all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' }, // Allow any origin or specify the domain
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ];
  },
};
