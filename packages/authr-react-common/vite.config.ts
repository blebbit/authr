import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { resolve } from 'path'
import react from '@vitejs/plugin-react-swc'
import dts from 'vite-plugin-dts'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    dts({
      include: ['src'],
      entryRoot: resolve(__dirname, "src"),
      tsconfigPath: resolve(__dirname, "tsconfig.app.json"),
      rollupTypes: true,
   })
  ],
  resolve: { alias: { "@/": resolve(__dirname, "src/") } },
  build: {
    lib: {
      entry: './src/index.tsx',
      formats: ['es', 'umd'],
      name: "authr-react-common",
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "tailwindcss"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          tailwindcss: "tailwindcss",
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
})
