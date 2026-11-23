import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

/**
 * Troca __SITE_URL__ no index.html pelo endereço do site, usado na prévia do link
 * (WhatsApp exige o endereço completo da imagem).
 * - SITE_URL, se definido (ex.: domínio próprio): https://danilotereza.com.br
 * - no Vercel: o endereço de produção do projeto, informado pelo próprio Vercel no build
 * - localmente: vazio (caminhos relativos; a prévia só importa no site publicado)
 */
function siteUrl(): Plugin {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL
  const url = (process.env.SITE_URL ?? (host ? `https://${host}` : '')).replace(/\/$/, '')
  return {
    name: 'site-url',
    transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', url),
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), siteUrl()],
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
