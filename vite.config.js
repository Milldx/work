import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({

  plugins: [
    vue(),
    vueDevTools(),
  ],
  base: '/work/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },

  plugins: [vue()],
  server: {
    port: 3000
  }

})