import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [viteStaticCopy({
    targets: [
      { src: 'src/appsscript.json', dest: '.' },
    ],
  })],
  build: {
    rollupOptions: {
      input: 'src/index.ts',
      treeshake: false,
      output: {
        entryFileNames: `Code.js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`
      }
    },
    outDir: './dist',
    emptyOutDir: false,
    minify: false,
  }
})