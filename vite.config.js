import path from 'path';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `@use "@/styles/_variables.scss" as vars;`
			}
		}
	},
	server: {
		https: {
			key: fs.readFileSync('certs/localhost+1-key.pem'),
			cert: fs.readFileSync('certs/localhost+1.pem')
		},
		host: 'localhost',
		port: 5173
	}
})
