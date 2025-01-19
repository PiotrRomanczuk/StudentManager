import { z } from 'zod';

const envSchema = z.object({
	DATABASE_URL: z.string().min(1),
	NEXT_PUBLIC_API_BASE_URL: z.string().url(),
	JWT_SECRET: z.string().min(32),
});

const env = envSchema.parse(process.env);

export default env;

try {
	envSchema.parse(process.env);
} catch (error) {
	console.error('Invalid environment variables:', error);
	process.exit(1);
}
