import { cloudflare } from '@cloudflare/vite-plugin'
import build from '@hono/vite-build/cloudflare-workers'
import { defineConfig } from 'vite'
import ssrHotReload from 'vite-plugin-ssr-hot-reload'
import { resolve } from "node:path";

const common = {
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    allowedHosts: [".blebbit.org"],
    cors: {
      origin: ["https://app.blebbit.org", "https://api.blebbit.org", "https://auth.blebbit.org"],
    }
  },
}

export default defineConfig(({ command, isSsrBuild }) => {
  if (command === 'serve') {
    return { ...common, plugins: [ssrHotReload(), cloudflare()] }
  }
  if (!isSsrBuild) {
    return {
      build: {
        rollupOptions: {
          input: ['./src/style.css'],
          output: {
            assetFileNames: 'assets/[name].[ext]'
          }
        }
      }
    }
  }
  return {
    plugins: [build({ outputDir: 'dist-server' })]
  }
})
