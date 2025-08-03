import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      // toutes les requêtes /ask et /upload passent par le backend
      '/ask':    'http://127.0.0.1:8000',
      '/upload/':'http://127.0.0.1:8000',
    },
  },
});
