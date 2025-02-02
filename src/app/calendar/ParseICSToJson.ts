type Event = {
	UID: string;
	DTSTART: string;
	DTEND: string;
	SUMMARY: string;
};

const formatDate = (dateString: string) => {
	const year = parseInt(dateString.substring(0, 4));
	const month = parseInt(dateString.substring(4, 6)) - 1; // Months are 0-based in JavaScript
	const day = parseInt(dateString.substring(6, 8));
	return new Date(year, month, day).toLocaleDateString(); // Adjust format as needed
};

export function parseICSToJSON(icsData: string): Event[] {
	const events = [];
	const veventRegex = /BEGIN:VEVENT([\s\S]*?)END:VEVENT/g;
	let match;

	while ((match = veventRegex.exec(icsData)) !== null) {
		const eventData = match[1];
		const event = {};

		eventData.split('\n').forEach((line) => {
			const [key, value] = line.split(':');
			if (key && value) {
				// Handle DTSTART and DTEND to extract the correct value
				if (key.startsWith('DTSTART') || key.startsWith('DTEND')) {
					const cleanValue = value.split(';')[0]; // Take the first part before any semicolon
					const cleanKey = key.split(';')[0]; // Get key without parameters
					if (cleanKey === 'DTSTART' || cleanKey === 'DTEND') {
						(event as Event)[cleanKey] = formatDate(cleanValue); // Format the date
					}
				} else if (key === 'UID' || key === 'SUMMARY') {
					(event as Event)[key] = value; // Only assign known keys directly
				}
			}
		});

		events.push(event);
	}

	return events as Event[];
}

export function getEventDates(events: Event[]): string[] {
	const dates: string[] = [];

	events.forEach((event) => {
		const startDate = new Date(event.DTSTART);
		const endDate = new Date(event.DTEND);
		const currentDate = new Date(startDate);

		while (currentDate <= endDate) {
			dates.push(currentDate.toLocaleDateString());
			currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
		}
	});

	return dates;
}
