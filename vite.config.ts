import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      '@supabase/supabase-js'
    ],
    esbuildOptions: {
      target: 'es2020'
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor'
            }
            if (id.includes('supabase')) {
              return 'supabase-vendor'
            }
            if (id.includes('lucide') || id.includes('radix')) {
              return 'ui-vendor'
            }
            if (id.includes('@tanstack')) {
              return 'query-vendor'
            }
            return 'vendor'
          }
        },
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      }
    },
    target: 'es2020',
    minify: 'terser',
    sourcemap: false,
    assetsDir: 'assets',
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn']
      }
    }
  },
  server: {
    port: 5173,
    host: true,
  },
  define: {
    global: 'globalThis',
  },
  esbuild: {
    target: 'es2020'
  },
})