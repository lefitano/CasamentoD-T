import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // O pacote da cena 3D (three.js) passa de 500 kB, mas é carregado sob demanda,
    // depois que o conteúdo já apareceu. O limite é ajustado para não esconder outros avisos.
    chunkSizeWarningLimit: 1000,
  },
  server: {
    // Permite abrir o site no celular pela rede local (mesmo Wi-Fi)
    host: true,
  },
})
