import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Ajout spécial StackBlitz
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // permet l'exposition publique
    port: 3000, // StackBlitz utilise le port 3000 automatiquement
    strictPort: true,
  },
});
