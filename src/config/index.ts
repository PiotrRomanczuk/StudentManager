const config = {
	api: {
		baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
		timeout: 5000,
	},
	db: {
		path: process.env.DB_PATH || './app.db',
	},
	auth: {
		// Add auth configuration
	},
} as const;

export default config;
