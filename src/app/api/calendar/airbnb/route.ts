import { NextResponse } from 'next/server';

export async function GET() {
	const url =
		'https://www.airbnb.com/calendar/ical/921541253367297308.ics?s=3500d8b515272c463f72ae3529949d95&locale=pl';

	const response = await fetch(url);
	const data = await response.text();

	return NextResponse.json(data);
}
