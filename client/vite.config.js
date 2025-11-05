import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react() , tailwindcss()],
  // Ensure base path is correct for deployment
  base: '/',
  // Preview server configuration for SPA routing
  preview: {
    port: 3000,
    host: true,
  },
  build: {
    // Ensure proper build output
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
