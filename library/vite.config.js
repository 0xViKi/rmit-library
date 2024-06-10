import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'
// import fs from 'fs'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mkcert()],
  server : { port: 443,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    }
    },

  }
)
