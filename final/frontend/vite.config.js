import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Redirige /api/* al backend Spring Boot en el puerto 8080
      '/api': {
        target: 'http://localhost:8070', // ← Puerto real del backend
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
