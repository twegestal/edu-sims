// apps/client/vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();
const enableSSL = process.env.ENABLE_SSL;

const options = {
  key: fs.readFileSync('C:/Users/vikto/Documents/GitHub/edu-sims/apps/server/certificates/key.pem'),
  cert: fs.readFileSync('C:/Users/vikto/Documents/GitHub/edu-sims/apps/server/certificates/cert.pem'),
}

export default defineConfig({
  plugins: [react()],
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
