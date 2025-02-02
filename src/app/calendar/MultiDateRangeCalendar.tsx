import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { isWithinInterval } from 'date-fns';

type Range = {
	from: Date;
	to: Date;
};

type MultiDateRangeCalendarProps = {
	selectedRanges: Range[];
};

export const MultiDateRangeCalendar: React.FC<MultiDateRangeCalendarProps> = ({
	selectedRanges,
}) => {
	const highlightDates = (date: Date) => {
		return selectedRanges.some((range) =>
			isWithinInterval(date, { start: range.from!, end: range.to! })
		);
	};

	return (
		<Card>
			<CardContent>
				<h1 className='text-xl font-bold mb-4'>Multi-Date Range Calendar</h1>
				<div className='mt-4'>
					<Calendar
						mode='single'
						modifiers={{ highlighted: highlightDates }}
						modifiersClassNames={{ highlighted: 'bg-red-500 ' }}
					/>
				</div>
			</CardContent>
		</Card>
	);
};

export default MultiDateRangeCalendar;
