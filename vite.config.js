import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: 'localhost',
    ...(process.env.VITE_HTTPS === 'true' && {
      https: {
        key: fs.readFileSync('/etc/letsencrypt/live/localhost/localhost-key.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/localhost/localhost-cert.pem'),
      },
    }),
  },
});