import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  base: './', // Esto hará que los recursos se carguen con rutas relativas
  server: {
    host: true
  }
})