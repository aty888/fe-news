import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/substack': {
        target: 'https://kofearticle.substack.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/substack/, '/api/v1')
      }
    }
  }
})
