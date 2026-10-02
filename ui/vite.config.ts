import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
    }),
    react(),
    tsconfigPaths(),
  ],
  server: {
    port: 5173,
    strictPort: true,
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'react-vendor',
              test: /node_modules[\\/](react|react-dom|jotai|@tanstack)[\\/]/,
              priority: 20,
            },
            {
              name: 'chakra-vendor',
              test: /node_modules[\\/](@chakra-ui|@emotion)[\\/]/,
              priority: 20,
            },
            {
              name: 'emoji-picker',
              test: /node_modules[\\/]emoji-picker-react[\\/]/,
              priority: 20,
            },
            {
              name: 'vendor',
              test: /node_modules[\\/]/,
              priority: 10,
            },
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
