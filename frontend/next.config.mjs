/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "**",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/rick",
        destination:
          "https://www.youtube.com/watch?v=dQw4w9WgXcQ&pp=ygULcmljayBhc3RsZXk%3D",
        permanent: true,
      },
      {
        source: "/getoutofmyswamp",
        destination:
          "https://www.youtube.com/watch?v=w5qvMdoxGnc&pp=ygUFc2hyZWs%3D",
        permanent: true,
      },
      {
        source: "/zoo",
        destination: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
        permanent: true,
      },
      {
        source: "/veggies",
        destination: "https://www.youtube.com/watch?v=MreUtmdNqpc",
        permanent: true,
      },
      {
        source: "/celebrate",
        destination:
          "https://www.youtube.com/watch?v=0CFBUSHzENI&pp=ygUKb29nYSBib29nYQ%3D%3D",
        permanent: true,
      },
      {
        source: "/dream",
        destination: "https://www.youtube.com/watch?v=XfqOB4hvxlY",
        permanent: true,
      },
      {
        source: "/oogabooga",
        destination: "https://www.youtube.com/watch?v=8eJZQbT0fgc",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
