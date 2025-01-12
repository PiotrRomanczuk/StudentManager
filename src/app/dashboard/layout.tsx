import NavBar from '@/components/NavBar';

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div>
			<NavBar />
			<main>{children}</main>
		</div>
	);
}
