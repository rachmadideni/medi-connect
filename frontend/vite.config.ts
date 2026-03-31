import { defineConfig, type ConfigEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }: ConfigEnv) => ({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: mode === 'development' ? {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true as const,
      },
    } : undefined,
  },
}));