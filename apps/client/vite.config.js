// apps/client/vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();
const enableSSL = process.env.ENABLE_SSL;

const options = {
  key: fs.readFileSync(process.env.PATH_TO_KEY),
  cert: fs.readFileSync(process.env.PATH_TO_CERT),
}

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
  },
  server: {
    https: options,
    proxy: {
      '/api': {
        secure: enableSSL === 'true',
        target: 'https://localhost:443',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
})
