export class APIError extends Error {
	constructor(message: string, public status: number, public code?: string) {
		super(message);
		this.name = 'APIError';
	}
}

export async function fetchApi<T>(
	url: string,
	options?: RequestInit
): Promise<T> {
	try {
		const response = await fetch(url, options);
		const data = await response.json();

		if (!response.ok) {
			throw new APIError(
				data.message || 'An error occurred',
				response.status,
				data.code
			);
		}

		return data;
	} catch (error) {
		if (error instanceof APIError) throw error;
		throw new APIError('Network error', 500);
	}
}
