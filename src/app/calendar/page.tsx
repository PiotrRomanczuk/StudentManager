'use client';

import { parseICSToJSON } from './ParseICSToJson';
import { MultiDateRangeCalendar } from './MultiDateRangeCalendar';

export async function fetchICSData(link: URL) {
	const response = await fetch(link);
	const icsData = await response.text();
	return icsData;
}

const AirBnb_Link = new URL('http:localhost:3000/calendar/airbnb');
const Booking_Link = new URL(
	'https://ical.booking.com/v1/export?t=be015c14-cbeb-44d5-b285-9a3e8928d745'
);
const airbnbICSData = await fetchICSData(AirBnb_Link);
const bookingICSData = await fetchICSData(Booking_Link);

const airbnbJsonEvents = parseICSToJSON(airbnbICSData);
const bookingJsonEvents = parseICSToJSON(bookingICSData);

const jsonEvents = [...airbnbJsonEvents, ...bookingJsonEvents];

export default function Page() {
	const selectedRanges = jsonEvents.map((event) => ({
		from: new Date(event.DTSTART),
		to: new Date(event.DTEND),
	}));

	return (
		<>
			<MultiDateRangeCalendar selectedRanges={selectedRanges} />
			<div>Calendar</div>

			{jsonEvents.map((event) => {
				console.log(event);
				return (
					<div key={event.UID}>
						<p>UID: {event.UID}</p>
						<p>Start Date: {event.DTSTART}</p>
						<p>End Date: {event.DTEND}</p>
						{/* <p>Summary: {event.SUMMARY}</p> */}
					</div>
				);
			})}
		</>
	);
}
