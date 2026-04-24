// import tailwindcss from '@tailwindcss/vite'
// import react from '@vitejs/plugin-react'
// import { defineConfig } from 'vite'

// // https://vite.dev/config/
// export default defineConfig({
// 	plugins: [tailwindcss(), react()],
// })

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    host: true, // позволяет подключаться извне
    port: 3000, // твой порт
    strictPort: false,
    allowedHosts: [
      'localhost', // для локальной работы
      'lienable-supersafely-calvin.ngrok-free.dev' // твой текущий ngrok URL
    ],
  },
})

