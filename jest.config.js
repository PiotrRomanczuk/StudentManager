const nextJest = require('next/jest');

const createJestConfig = nextJest({
	// Provide the path to your Next.js app to load next.config.js and .env files
	dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	testEnvironment: 'jsdom',
	testPathIgnorePatterns: [
		'<rootDir>/.next/',
		'<rootDir>/node_modules/',
		// Skip React component tests when in production
		...(process.env.NODE_ENV === 'production'
			? [
					'<rootDir>/src/__tests__/auth/signin.test.tsx',
					'<rootDir>/src/__tests__/auth/signup.test.tsx',
					'<rootDir>/src/__tests__/auth/components.test.tsx',
					'<rootDir>/src/__tests__/dashboard/role-based-rendering.test.tsx',
			  ]
			: []),
	],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
	},
	collectCoverageFrom: [
		'src/**/*.{js,jsx,ts,tsx}',
		'!src/**/*.d.ts',
		'!src/**/*.stories.{js,jsx,ts,tsx}',
		'!src/**/*.test.{js,jsx,ts,tsx}',
		'!src/**/*.spec.{js,jsx,ts,tsx}',
		'!src/__tests__/**/*',
		'!src/**/__tests__/**/*',
		'!src/**/test/**/*',
		'!src/**/tests/**/*',
		'!src/**/coverage/**/*',
		'!src/**/node_modules/**/*',
		'!src/**/.next/**/*',
		'!src/**/dist/**/*',
		'!src/**/build/**/*',
		'!src/**/.jest/**/*',
		'!src/**/jest.config.*',
		'!src/**/jest.setup.*',
		'!src/**/jest.env.setup.*',
		'!src/**/next.config.*',
		'!src/**/tailwind.config.*',
		'!src/**/postcss.config.*',
		'!src/**/babel.config.*',
		'!src/**/.eslintrc.*',
		'!src/**/tsconfig.*',
		'!src/**/package.json',
		'!src/**/package-lock.json',
		'!src/**/yarn.lock',
		'!src/**/pnpm-lock.yaml',
		'!src/**/README.md',
		'!src/**/.gitignore',
		'!src/**/.env*',
		'!src/**/.env.local',
		'!src/**/.env.development.local',
		'!src/**/.env.test.local',
		'!src/**/.env.production.local',
	],
	testMatch: [
		'<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
		'<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
	],
	moduleDirectories: ['node_modules', '<rootDir>/'],
	testEnvironmentOptions: {
		customExportConditions: [''],
	},
	transform: {
		'^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
	},
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	globals: {
		'ts-jest': {
			tsconfig: {
				jsx: 'react-jsx',
			},
		},
	},

	// Force test environment for all tests
	setupFiles: ['<rootDir>/jest.env.setup.js'],

	// Coverage configuration
	coverageDirectory: 'coverage',
	coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
	coverageThreshold: {
		global: {
			branches: 0,
			functions: 0,
			lines: 0,
			statements: 0,
		},
	},
	collectCoverage: true,
	coverageProvider: 'v8',

	// Add reporters for test results
	reporters: [
		'default',
		[
			'jest-junit',
			{
				outputDirectory: 'reports',
				outputName: `report-${Date.now()}.xml`, // Add timestamp for uniqueness
			},
		],
	],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
