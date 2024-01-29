import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    optimizeDeps: {
        include: ['@kangc/v-md-editor/lib/theme/vuepress.js'],
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src")
        }
    },
    plugins: [vue()],
})
