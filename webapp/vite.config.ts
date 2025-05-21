//ทำให้รองรับ reverse proxie
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "/webapp/", // ตั้งค่า Base Path ให้ตรงกับ Reverse Proxy
  build: {
  outDir: "dist/webapp" // ✅ ตรงกับ firebase.json
  },
  server: {
    host: "0.0.0.0", // ให้ Docker container ใช้ Vite dev server ได้
    port: 5173,
    strictPort: true
  }
})