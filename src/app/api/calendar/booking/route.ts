import { NextResponse } from 'next/server';

export async function GET() {
	const url =
		'https://ical.booking.com/v1/export?t=be015c14-cbeb-44d5-b285-9a3e8928d745';

	const response = await fetch(url);
	const data = await response.text();

	return NextResponse.json(data);
}
