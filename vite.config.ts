import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const source = (file: string) => fileURLToPath(new URL(file, import.meta.url));

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: {
        index: source('./src/index.ts'),
        Welcome: source('./src/components/Welcome/Welcome.tsx'),
        ColorSchemeToggle: source('./src/components/ColorSchemeToggle/ColorSchemeToggle.tsx'),
        CVESummary: source('./src/components/CVESummary/CVESummary.tsx'),
        Navbar: source('./src/components/Navbar/Navbar.tsx'),
      },
      formats: ['es'],
    },
    rolldownOptions: {
      external: [/^react(?:\/.*)?$/, /^react-dom(?:\/.*)?$/],
    },
  },
});
