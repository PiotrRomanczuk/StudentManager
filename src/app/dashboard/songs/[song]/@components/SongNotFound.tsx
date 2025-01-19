import { Link, ArrowLeft } from 'lucide-react';
import React from 'react';

const SongNotFound = () => {
	return (
		<div>
			<Link
				href='/dashboard/'
				className='flex items-center mb-6 text-blue-500 hover:text-blue-600'
			>
				<ArrowLeft className='mr-20' size={24} />
				Back to Songs
			</Link>
			Song not found
		</div>
	);
};

export default SongNotFound;
