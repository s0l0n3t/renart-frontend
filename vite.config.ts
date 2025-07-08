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
      '/prod': {
        target: 'http://signalseek.xyz:8180', // API sunucu adresi
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/prod/, ''), // /api önekini /prod'a çevir
        headers:{
          'Access-Control-Allow-Origin': '*',
        },
        secure: false, // HTTPS kullanmıyorsanız
      },
    }
  },
  // Environment variables için ek yapılandırma
  define: {
    'import.meta.env.API_BASE_URL': JSON.stringify('http://signalseek.xyz:8180')
  }
})