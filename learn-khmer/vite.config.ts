import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// base is passed via --base flag in build:pages script
export default defineConfig({
  plugins: [react()],
})
