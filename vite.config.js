import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

const optimizeCloudinaryImageUrl = (url, { width, quality = 'auto', format = 'auto' } = {}) => {
  if (!url?.includes('res.cloudinary.com/')) return url ?? ''
  if (/\/upload\/[^/]*,/.test(url)) return url

  const transforms = [`q_${quality}`, `f_${format}`, 'c_limit']
  if (width) transforms.unshift(`w_${width}`)

  return url.replace('/upload/', `/upload/${transforms.join(',')}/`)
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const heroImageUrl = optimizeCloudinaryImageUrl(env.VITE_MEDIA_IMG_URL, {
    width: 1200,
  })

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'inject-hero-preload',
        transformIndexHtml: {
          order: 'pre',
          handler(html) {
            if (!heroImageUrl) return html

            return html.replace(
              '</head>',
              `    <link rel="preload" as="image" href="${heroImageUrl}" fetchpriority="high" />\n  </head>`,
            )
          },
        },
      },
    ],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-motion': ['framer-motion'],
            'vendor-ui': ['react-paginate', 'react-lazy-load-image-component'],
            'vendor-pdf': ['jspdf', 'html2canvas'],
          },
        },
      },
    },
  }
})
