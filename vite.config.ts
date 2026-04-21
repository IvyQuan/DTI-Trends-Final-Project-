import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
<<<<<<< Updated upstream
      '/api': 'http://localhost:3001',
=======
      '/api': 'http://localhost:5000',
>>>>>>> Stashed changes
    },
  },
})
