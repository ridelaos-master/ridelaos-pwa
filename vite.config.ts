import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// api/ 폴더는 Vercel Serverless 전용 — Vite 변환/감시 제외
function excludeApiFromVite() {
  return {
    name: 'exclude-api',
    resolveId(id: string) {
      if (id.startsWith('api/') || id.includes('/api/')) {
        return { id, external: true }
      }
      return null
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const kakaoSecret = env.KAKAO_PAY_SECRET ?? ''

  return {
  build: {
    // S4-08: 코드 스플리팅 + 최적화
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // 프로덕션에서 console.log 제거
        drop_debugger: true,
      },
    },
    rollupOptions: {
      external: [/^api\//],
      output: {
        // S4-08: 청크 분리 — 큰 라이브러리 별도 로드
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-mapbox': ['mapbox-gl'],
          'vendor-form': ['react-hook-form', '@hookform/resolvers', 'zod'],
        },
      },
    },
    chunkSizeWarningLimit: 300,
  },
  server: {
    watch: {
      ignored: ['**/api/**'],
    },
    proxy: {
      '/kakaopay': {
        target: 'https://open-api.kakaopay.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/kakaopay/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            proxyReq.setHeader('Authorization', `SECRET_KEY ${kakaoSecret}`)
            console.log('[Proxy] →', req.method, req.url)
            console.log('[Proxy] Authorization:', `SECRET_KEY ${kakaoSecret.substring(0, 8)}...`)
          })
          proxy.on('proxyRes', (proxyRes, _req, _res) => {
            console.log('[Proxy] ← Status:', proxyRes.statusCode)
            let body = ''
            proxyRes.on('data', (chunk) => { body += chunk })
            proxyRes.on('end', () => {
              console.log('[Proxy] ← Body:', body)
            })
          })
          proxy.on('error', (err) => {
            console.log('[Proxy] Error:', err.message)
          })
        },
      },
    },
  },
  plugins: [
    excludeApiFromVite(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        name: 'Ride Laos',
        short_name: 'RideLaos',
        description: '라오스 오토바이 투어 예약',
        theme_color: '#1A3A2A',
        background_color: '#F5F5F5',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        id: 'https://ridelaos.com/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.mapbox\.com\/styles\/v1\//i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'mapbox-tiles-auto',
              expiration: {
                maxEntries: 300,
                maxAgeSeconds: 7 * 24 * 60 * 60,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/api\.mapbox\.com\/(fonts|sprites)\//i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'mapbox-assets',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // S4-08: Supabase API 캐싱
            urlPattern: /^https:\/\/.*\.supabase\.co\/rest\//i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 5 * 60,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/events\.mapbox\.com\/.*/i,
            handler: 'NetworkOnly',
          },
        ],
      },
    }),
  ],
  }
})