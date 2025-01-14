import NavBar from '@/components/NavBar/NavBar';

interface LayoutProps {
	children: React.ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
	return (
		<div>
			<NavBar />
			<main>{children}</main>
		</div>
	);
}
