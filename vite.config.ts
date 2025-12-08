import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'BragiUI',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: [
        {
          format: 'es',
          entryFileNames: 'index.es.js',
          dir: 'dist'
        },
        {
          format: 'umd',
          entryFileNames: 'index.js',
          dir: 'dist',
          name: 'BragiUI',
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM'
          }
        }
      ]
    }
  }
})
