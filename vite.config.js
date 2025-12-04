import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Router_project/',
  server: {
    // Открывать браузер при старте dev-сервера
    open: true,
  },
})
