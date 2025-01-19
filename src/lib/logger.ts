type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
	private context?: string;

	constructor(context?: string) {
		this.context = context;
	}

	private log(
		level: LogLevel,
		message: string,
		meta?: Record<string, unknown>
	) {
		const timestamp = new Date().toISOString();
		const logData = {
			timestamp,
			level,
			context: this.context,
			message,
			...(meta && { meta }),
		};

		// In development
		if (process.env.NODE_ENV === 'development') {
			console.log(JSON.stringify(logData, null, 2));
		} else {
			// In production, send to logging service
			// e.g., winston, pino, etc.
		}
	}

	debug(message: string, meta?: Record<string, unknown>) {
		this.log('debug', message, meta);
	}

	info(message: string, meta?: Record<string, unknown>) {
		this.log('info', message, meta);
	}

	// ... other methods
}

export const logger = new Logger();
