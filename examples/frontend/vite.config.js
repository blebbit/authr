// import { cloudflare } from '@cloudflare/vite-plugin'
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { cloudflare } from 'unenv'


import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { resolve } from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite({ autoCodeSplitting: true }), viteReact(), tailwindcss()],
  test: {
    globals: true,
    environment: "jsdom",
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    preset: 'cloudflare-pages',
    unenv: cloudflare,
    port: 3000,
    allowedHosts: [".blebbit.org"],
    cors: {
      origin: ["https://app.blebbit.org", "https://api.blebbit.org", "https://auth.blebbit.org"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "atproto-proxy"],
    }
  },
});
