import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.VITE_NODE_ENV': JSON.stringify(process.env.VITE_NODE_ENV),
    'process.env.VITE_SOCKET_URL': JSON.stringify(process.env.VITE_SOCKET_URL),
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
  }
})
