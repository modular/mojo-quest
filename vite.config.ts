import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `base` is set for GitHub Pages project-site hosting. Change to '/' for root hosting.
export default defineConfig({
  base: './',
  plugins: [react()],
})
