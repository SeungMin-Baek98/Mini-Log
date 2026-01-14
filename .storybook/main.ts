import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
	stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	addons: ['@storybook/addon-styling-webpack'],
	framework: '@storybook/react-vite',
	async viteFinal(config) {
		config.resolve = config.resolve ?? {};
		config.resolve.alias = {
			...(config.resolve.alias ?? {}),
			'@': path.resolve(__dirname, '../src')
		};
		return config;
	}
};

export default config;
