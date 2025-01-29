import { Button } from '../../../../components/ui/button';
import { Alert, AlertDescription } from '../../../../components/ui/alert';

interface ErrorComponentProps {
	error: string;
	loadSongs?: () => void;
}

export function ErrorComponent({ error, loadSongs }: ErrorComponentProps) {
	return (
		<div className='container mx-auto max-w-4xl'>
			<div className='my-8 text-center'>
				<Alert variant='destructive' className='mb-4'>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
				<Button variant='default' onClick={loadSongs}>
					Try Again
				</Button>
			</div>
		</div>
	);
}
