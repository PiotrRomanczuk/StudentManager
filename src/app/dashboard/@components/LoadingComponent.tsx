interface LoadingComponentProps {
	message: string;
}

export function LoadingComponent({ message }: LoadingComponentProps) {
	return (
		<div className='container max-w-4xl mx-auto'>
			<div className='my-4 text-center'>
				<p className='text-xl font-semibold'>{message}</p>
			</div>
		</div>
	);
}
