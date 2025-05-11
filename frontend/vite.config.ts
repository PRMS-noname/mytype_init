import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  const devPort = parseInt(env.VITE_DEV_SERVER_PORT || '5173')
  const previewPort = parseInt(env.VITE_PREVIEW_SERVER_PORT || '3000')
  const apiPrefix = env.VITE_API_PREFIX || '/api'

  return {
    plugins: [react()],
    server: {
      port: devPort,
      host: true,
      proxy: {
        [apiPrefix]: {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path: string) =>
            path.replace(new RegExp(`^${apiPrefix}`), ''),
        },
      },
    },
    preview: {
      port: previewPort,
      host: true,
    },
  }
})
