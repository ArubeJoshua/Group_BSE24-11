import type { Config } from 'jest'
import nextJest from 'next/jest'

// Create Jest configuration for Next.js app
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Custom Jest configuration
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  // Adding moduleNameMapper to resolve @ alias
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Adjust the path to match your project structure
  },
  
}

// Export Jest config so next/jest can load the Next.js config
export default createJestConfig(config)
