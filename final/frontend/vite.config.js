import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],

  // En producción el frontend llama directamente al backend (o via proxy Vercel/Nginx).
  // VITE_API_URL se inyecta como variable de entorno en la plataforma de despliegue.
  // En desarrollo queda vacío y el proxy de Vite se encarga.
  define: {
    __API_BASE__: JSON.stringify(
      mode === 'production' ? (process.env.VITE_API_URL ?? 'https://marazulback.onrender.com') : ''
    ),
  },

  server: {
    port: 5173,
    proxy: {
      // Solo activo en desarrollo: redirige /api/* al backend local
      '/api': {
        target: 'http://localhost:8070',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
  },
}))
