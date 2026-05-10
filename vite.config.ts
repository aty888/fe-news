import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/substack': {
        target: 'https://kofearticle.substack.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/substack/, '/api/v1'),
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Referer': 'https://kofearticle.substack.com/',
        }
      }
    }
  }
})
