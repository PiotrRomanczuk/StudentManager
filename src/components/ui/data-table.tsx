'use client';

import { ReactNode } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

interface DataTableProps {
	children: ReactNode;
	className?: string;
}

export function DataTable({ children, className = '' }: DataTableProps) {
	return (
		<div className='space-y-4 w-full max-w-full'>
			<div className='bg-white rounded-lg shadow-md p-2 sm:p-4 md:p-6 w-full max-w-full overflow-x-auto'>
				<Table className={`w-full max-w-full table-fixed ${className}`}>
					{children}
				</Table>
			</div>
		</div>
	);
}

export { TableBody, TableCell, TableHead, TableHeader, TableRow };
