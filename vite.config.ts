import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // API endpoint'leri için proxy ayarları
      '/api': {
        target: 'http://signalseek.xyz:8180', // API sunucu adresi
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/prod'), // /api önekini /prod'a çevir
        secure: false, // HTTPS kullanmıyorsanız
      },
      // Diğer endpoint'ler için ek proxy kuralları
      '/another-api': {
        target: 'http://another-api.example.com',
        changeOrigin: true,
      }
    }
  },
  // Environment variables için ek yapılandırma
  define: {
    'import.meta.env.API_BASE_URL': JSON.stringify('http://signalseek.xyz:8180')
  }
})