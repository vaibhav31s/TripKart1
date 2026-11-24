import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Replaces the CRA "proxy" setting: API calls made with relative URLs
// (e.g. axios.get("/hotels")) are forwarded to the backend under /api.
// Browser page navigations (Accept: text/html) are still served by Vite.
const API_TARGET = process.env.API_URL || "http://localhost:8800";
const apiPaths = ["/auth", "/users", "/hotels", "/rooms"];

const proxy = Object.fromEntries(
  apiPaths.map((path) => [
    path,
    {
      target: API_TARGET,
      changeOrigin: true,
      rewrite: (p) => "/api" + p,
      bypass: (req) =>
        req.headers.accept?.includes("text/html") ? "/index.html" : undefined,
    },
  ])
);

export default defineConfig({
  plugins: [react()],
  server: { port: 3001, proxy },
  build: { outDir: "build" },
});
