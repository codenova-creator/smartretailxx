import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const BACKEND_TARGET = 'http://SmartRetailX-ALB-123532839.ap-south-1.elb.amazonaws.com';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: BACKEND_TARGET,
        changeOrigin: true,
        secure: false
      },
      '/swagger': {
        target: BACKEND_TARGET,
        changeOrigin: true,
        secure: false
      },
      '/health': {
        target: BACKEND_TARGET,
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
