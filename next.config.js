module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*', // ajusta esta URL según tu configuración de servidor API
      },
    ];
  },
};
