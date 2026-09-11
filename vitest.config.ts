import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        projects: [
            {
                extends: true,
                test: {
                    name: "integration",
                    setupFiles: ['./src/tests/setup.ts'],
                    clearMocks: true,
                    include: ['./src/tests/**/*.integration.test.ts'],
                    exclude: [],
                    hookTimeout: 30000,
                    env: {
                        NODE_ENV: 'test'
                    }
                }
            },
            {
                extends: true,
                test: {
                    name: "unit",
                    clearMocks: true,
                    include: ['./src/tests/**/*.unit.test.ts'],
                    exclude: [],
                }
            },
        ]
    }
})