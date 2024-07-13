module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "/public/uploads/:path*",
      },
      // {
      //   source: "/api/:path*",
      //   destination:
      //     "https://66924178fc1cfb03ca258489--gregarious-churros-860e3a.netlify.app/:path*", // Replace with your backend URL
      // },
    ];
  },
};
