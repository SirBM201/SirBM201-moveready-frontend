const PRODUCTION_BACKEND = "https://moveready-mvp-production.up.railway.app";

function backendOrigin() {
  const fallback =
    process.env.NODE_ENV === "production"
      ? PRODUCTION_BACKEND
      : "http://127.0.0.1:8000";
  const configured =
    process.env.MOVEREADY_BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    fallback;

  try {
    const url = new URL(configured);
    const hostname = url.hostname.toLowerCase();
    const isPrivateHostname =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1" ||
      hostname.endsWith(".internal") ||
      hostname.endsWith(".railway.internal");

    if (
      process.env.NODE_ENV === "production" &&
      (url.protocol !== "https:" || isPrivateHostname)
    ) {
      throw new Error("Production backend must use a public HTTPS origin.");
    }

    return url.origin;
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      const detail = error instanceof Error ? error.message : "invalid URL";
      throw new Error(`MoveReady backend configuration is invalid: ${detail}`);
    }
    return fallback;
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const backend = backendOrigin();
    return [
      {
        source: "/api/:path*",
        destination: `${backend}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
