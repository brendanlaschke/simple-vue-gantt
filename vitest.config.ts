import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': '/Users/brendanlaschke/Documents/Leitart/vue-simple-gantt/src'
    }
  },
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'src/demo/**',
        'src/__stories/**',
        '**/*.stories.ts',
        '**/*.test.ts',
        '**/*.spec.ts',
        '.storybook/**'
      ]
    }
  }
});
