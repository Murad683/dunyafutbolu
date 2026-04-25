import { defineConfig } from '@tanstack/react-start/config'

console.log("APP.CONFIG.TS IS LOADED! PRESET IS VERCEL");

export default defineConfig({
  server: {
    preset: 'vercel'
  }
})
