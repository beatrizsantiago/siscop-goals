import { defineConfig } from 'vite';
import { federation } from '@module-federation/vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'goals',
      filename: 'remoteEntry.js',
      exposes: {
        './goals-app': './src/App/index.tsx',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  server: {
    port: 3006,
    cors: true
  },
  resolve: {
    alias: {
      '@domain': path.resolve(__dirname, 'src/domain'),
      '@usecases': path.resolve(__dirname, 'src/usecases'),
      '@App': path.resolve(__dirname, 'src/App'),
      '@fb': path.resolve(__dirname, 'src/firebase'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
    },
  },
  build: {
    target: 'esnext',
  },
})
