import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        name: "integration",
        setupFiles: ['./src/tests/setup.ts'],
        clearMocks: true,
        include: ['./src/tests/**/*.integration.test.ts'],
        exclude: [],
        fileParallelism: false,
        hookTimeout: 30000,
        env: {
            NODE_ENV: 'test'
        }
    },
})