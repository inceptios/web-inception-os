import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),svgr()],
  resolve:{
    alias:{
      '@configs':path.resolve(import.meta.dirname,'./src/configs'),
      '@components':path.resolve(import.meta.dirname,'./src/components'),
      '@assets':path.resolve(import.meta.dirname,'./src/assets')
    }
  }
})
