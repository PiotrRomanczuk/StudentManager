import GoogleDrive from './google-drive';
import GoogleLogin from './google-login';

export default async function TestingPage() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-start py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">Google Integration Testing</h1>
					<p className="mt-2 text-center text-sm text-gray-600">
						Test Google Login and Google Drive features below.
					</p>
				</div>
				<div className="space-y-6">
					<GoogleLogin />
					<GoogleDrive />
				</div>
			</div>
		</div>
	);
}
