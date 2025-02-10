import formsPlugin from '@tailwindcss/forms'
import flowbitePlugin from 'flowbite/plugin'

// eslint-disable-next-line no-undef
module.exports = {
	content: [
		'./src/**/*.html',
		'./src/**/*.{js,jsx,ts,tsx}',
		'node_modules/flowbite-react/lib/esm/**/*.js'
	],
	theme: {
		extend: {
			colors: {
				primary: '#1c3042',
				secondary: '#26e5ec',
				tertiary: '#228fb0',
				darkBlue: '#1f5c80',
				primaryRed: '#ff5555'
			}
		}
	},
	plugins: [formsPlugin, flowbitePlugin]
}
