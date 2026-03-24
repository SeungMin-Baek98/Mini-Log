import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type PluginOption } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		visualizer({
			filename: 'dist/stats.html'
		}) as PluginOption
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src')
		}
	}
});
