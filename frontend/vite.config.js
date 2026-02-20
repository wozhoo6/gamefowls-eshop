import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // listen on network IP
    proxy: {
      '/api': {
        target: 'http://192.168.254.102:3000', // use your PC's local IP
        changeOrigin: true
      }
    }
  }
})
