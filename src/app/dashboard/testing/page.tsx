import GoogleDrive from './google-drive';
import GoogleLogin from './google-login';

export default async function TestingPage() {
	return (
		<>
			<GoogleLogin />
			<GoogleDrive />
		</>
	);
}
