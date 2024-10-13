import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Beat-The-Chasers-PWA/',
  plugins: [
    vue(),
    viteStaticCopy({
      targets: [
        {
          src: 'src/assets',
          dest: ''
        },
        {
          src: './sw.js',
          dest: ''
        }
      ]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
