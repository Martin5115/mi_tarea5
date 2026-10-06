import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // En desarrollo (npm run dev) las peticiones a /agenda van al servidor Express
    proxy: {
      '/agenda': 'http://localhost:3000',
    },
  },
});
