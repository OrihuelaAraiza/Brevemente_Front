import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const APP_VERSION =
  process.env.VITE_APP_VERSION ||
  process.env.VERCEL_GIT_COMMIT_SHA ||
  process.env.GITHUB_SHA ||
  "dev";
const APP_COMMIT_MESSAGE =
  process.env.VITE_APP_COMMIT_MESSAGE ||
  process.env.VERCEL_GIT_COMMIT_MESSAGE ||
  "";
const VERCEL_ENV = process.env.VITE_VERCEL_ENV || process.env.VERCEL_ENV || "";

process.env.VITE_APP_VERSION = APP_VERSION;
process.env.VITE_APP_COMMIT_MESSAGE = APP_COMMIT_MESSAGE;
process.env.VITE_VERCEL_ENV = VERCEL_ENV;

// BreveMente es un repo dedicado: el frontend siempre habla con su API
// (Brevemente_Api en :4002 en local). Para deploy, el front pega a la URL de
// producción de su backend vía VITE_API_BASE_URL.
const PROXY_TARGET = process.env.VITE_API_PROXY_TARGET || "http://127.0.0.1:4002";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  server: {
    port: 5175,
    strictPort: false,
    proxy: {
      "/api": {
        target: PROXY_TARGET,
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      "/api-dipomex": {
        target: "https://api.tau.com.mx/dipomex/v1",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-dipomex/, ""),
      },
    },
  },
});
