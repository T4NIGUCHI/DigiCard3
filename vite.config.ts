import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import env from "vite-plugin-env-compatible";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), env({ prefix: "VITE", mountedPath: "process.env" })],
  build: {
    outDir: 'dist', // デフォルトが 'dist' なのでこの行は省略可能
  },
})

