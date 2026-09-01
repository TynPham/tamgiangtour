import type { NextConfig } from "next";

import { productionSecurityHeaders } from "./src/security/headers";

const nextConfig: NextConfig = {
  async headers() {
    return [
      ...(process.env.NODE_ENV === "production"
        ? [
            {
              source: "/:path*",
              headers: productionSecurityHeaders(),
            },
          ]
        : []),
      {
        source: "/dev/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
    ];
  },
};

export default nextConfig;
