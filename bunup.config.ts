import { defineConfig } from 'bunup'

export default defineConfig({
	entry: 'src/index.ts',
	name: 'node',
	format: 'esm',
	target: 'node',
	dts: {
		resolve: true
	},
	outDir: 'dist'
})
