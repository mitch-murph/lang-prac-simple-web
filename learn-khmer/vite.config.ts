import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// VITE_BASE env var used for GitHub Pages deployment (e.g. /learn-khmer/)
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE ?? '/',
})
