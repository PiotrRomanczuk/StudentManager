import { cookies } from 'next/headers';
import { google } from 'googleapis';
import oAuth2Client from '@/utils/google/google-auth';
import { AxiosError } from 'axios';

interface DriveFile {
	id: string;
	name: string;
	mimeType: string;
	webViewLink: string;
	createdTime: string;
}

async function getDriveFiles() {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get('google_access_token')?.value;

	console.log('Access Token:', accessToken ? 'Present' : 'Missing');

	if (!accessToken) {
		return null;
	}

	oAuth2Client.setCredentials({ access_token: accessToken });
	const drive = google.drive({ version: 'v3', auth: oAuth2Client });

	try {
		console.log('Making Drive API request...');
		const response = await drive.files.list({
			pageSize: 100,
			fields:
				'files(id, name, mimeType, webViewLink, createdTime, size, owners)',
			orderBy: 'createdTime desc',
			spaces: 'drive',
			corpora: 'user',
		});

		console.log('Drive API Response:', {
			status: response.status,
			statusText: response.statusText,
			data: response.data,
			request: {
				url: response.config?.url,
				method: response.config?.method,
				headers: response.config?.headers,
			},
		});

		if (!response.data.files) {
			console.log('No files found in response');
			return [];
		}

		return response.data.files as DriveFile[];
	} catch (error) {
		console.error('Error fetching files:', error);
		if (error instanceof AxiosError && error.response) {
			console.error('Error response:', {
				status: error.response.status,
				data: error.response.data,
				headers: error.response.headers,
			});
		}
		return null;
	}
}

export default async function GoogleDrive() {
	const files = await getDriveFiles();

	if (!files) {
		return (
			<div className='p-4'>
				<h2 className='text-xl font-semibold mb-4'>Google Drive Files</h2>
				<p className='text-gray-500'>
					Please log in to view your Google Drive files.
				</p>
			</div>
		);
	}

	if (files.length === 0) {
		return (
			<div className='p-4'>
				<h2 className='text-xl font-semibold mb-4'>Google Drive Files</h2>
				<p className='text-gray-500'>No files found in your Google Drive.</p>
				<p className='text-sm text-gray-400 mt-2'>
					If you believe this is an error, please try logging out and logging
					back in.
				</p>
			</div>
		);
	}

	return (
		<div className='p-4'>
			<h2 className='text-xl font-semibold mb-4'>Google Drive Files</h2>
			<div className='space-y-4'>
				{files.map((file) => (
					<div
						key={file.id}
						className='p-4 border rounded-lg hover:bg-gray-50 transition-colors'
					>
						<div className='flex items-center justify-between'>
							<div>
								<h3 className='font-medium'>{file.name}</h3>
								<p className='text-sm text-gray-500'>
									{new Date(file.createdTime).toLocaleDateString()}
								</p>
							</div>
							<a
								href={file.webViewLink}
								target='_blank'
								rel='noopener noreferrer'
								className='text-blue-600 hover:text-blue-800'
							>
								View
							</a>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
