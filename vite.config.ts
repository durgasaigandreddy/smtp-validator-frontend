import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backend = env.VITE_BACKEND_ORIGIN ?? 'http://127.0.0.1:8000'
  const proxy = Object.fromEntries(
    ['/v1', '/admin', '/healthz', '/bootstrap'].map((path) => [
      path,
      { target: backend, changeOrigin: true },
    ]),
  )

  return {
    plugins: [react(), tailwindcss()],
    server: { port: 5173, proxy },
  }
})
