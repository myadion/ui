import { defineConfig } from 'vite'

export default defineConfig({
    // entry point css file
    build: {
        lib: {
            name: 'my-lib',
            entry: 'src/sass/adion-ui-kit.scss',
        },
        outDir: 'dist/' + require('./package.json').version,
        manifest: true,
    },
})
