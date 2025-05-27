import { cookies } from 'next/headers';
import { google } from 'googleapis';
import oAuth2Client from '@/utils/google/google-auth';
import { AxiosError } from 'axios';
import { FaFileAlt, FaFileImage, FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, FaFileArchive, FaFileVideo, FaFileAudio, FaFileCode } from 'react-icons/fa';
import Image from "next/image";

interface DriveFile {
	id: string;
	name: string;
	mimeType: string;
	webViewLink: string;
	createdTime: string;
}

function getFileIcon(mimeType: string) {
	switch (true) {
		case /image\//.test(mimeType): return <FaFileImage className="text-blue-400" />;
		case /pdf$/.test(mimeType): return <FaFilePdf className="text-red-500" />;
		case /word/.test(mimeType): return <FaFileWord className="text-blue-700" />;
		case /excel/.test(mimeType): return <FaFileExcel className="text-green-600" />;
		case /powerpoint/.test(mimeType): return <FaFilePowerpoint className="text-orange-600" />;
		case /zip|rar|archive/.test(mimeType): return <FaFileArchive className="text-yellow-600" />;
		case /video/.test(mimeType): return <FaFileVideo className="text-purple-600" />;
		case /audio/.test(mimeType): return <FaFileAudio className="text-pink-600" />;
		case /code|javascript|typescript|python|json/.test(mimeType): return <FaFileCode className="text-gray-700" />;
		default: return <FaFileAlt className="text-gray-400" />;
	}
}

async function getDriveFiles() {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get('google_access_token')?.value;

	if (!accessToken) {
		return { files: null, error: null };
	}

	oAuth2Client.setCredentials({ access_token: accessToken });
	const drive = google.drive({ version: 'v3', auth: oAuth2Client });

	try {
		const response = await drive.files.list({
			pageSize: 100,
			fields:
				'files(id, name, mimeType, webViewLink, createdTime, size, owners)',
			orderBy: 'createdTime desc',
			spaces: 'drive',
			corpora: 'user',
		});
		if (!response.data.files) {
			return { files: [], error: null };
		}
		return { files: response.data.files as DriveFile[], error: null };
	} catch (error) {
		return { files: null, error: error instanceof AxiosError ? error.message : 'Unknown error' };
	}
}

export default async function GoogleDrive() {
	// Simulate loading state for UX (remove in prod)
	// await new Promise(res => setTimeout(res, 800));
	const { files, error } = await getDriveFiles();

	if (error) {
		return (
			<div className="p-4 text-center">
				<h2 className="text-xl font-semibold mb-4">Google Drive Files</h2>
				<p className="text-red-500">Error: {error}</p>
				<p className="text-gray-400 mt-2">Try logging in again or check your connection.</p>
			</div>
		);
	}

	if (!files) {
		return (
			<div className="p-4 text-center">
				<h2 className="text-xl font-semibold mb-4">Google Drive Files</h2>
				<p className="text-gray-500">Please log in to view your Google Drive files.</p>
			</div>
		);
	}

	if (files.length === 0) {
		return (
			<div className="p-4 text-center">
				<h2 className="text-xl font-semibold mb-4">Google Drive Files</h2>
				<Image src="/no-files.svg" alt="No files" width={96} height={96} className="mx-auto mb-2 w-24 h-24 opacity-60" />
				<p className="text-gray-500">No files found in your Google Drive.</p>
				<p className="text-sm text-gray-400 mt-2">If you believe this is an error, please try logging out and logging back in.</p>
			</div>
		);
	}

	return (
		<div className="p-4">
			<h2 className="text-xl font-semibold mb-4">Google Drive Files</h2>
			<div className="space-y-4">
				{files.map((file) => (
					<div
						key={file.id}
						className="p-4 border rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-4"
					>
						<span className="text-2xl">{getFileIcon(file.mimeType)}</span>
						<div className="flex-1">
							<h3 className="font-medium">{file.name}</h3>
							<p className="text-sm text-gray-500">
								{new Date(file.createdTime).toLocaleDateString()}
							</p>
						</div>
						<a
							href={file.webViewLink}
							target="_blank"
							rel="noopener noreferrer"
							className="text-blue-600 hover:text-blue-800 font-semibold"
						>
							View
						</a>
					</div>
				))}
			</div>
		</div>
	);
}
