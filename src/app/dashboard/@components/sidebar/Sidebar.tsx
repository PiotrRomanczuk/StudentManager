"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import SIDEBAR_LIST from './SIDEBAR_LIST';

interface SidebarProps {
	children: React.ReactNode;
	isAdmin: boolean;
}

export default function Sidebar({ children, isAdmin }: SidebarProps) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [isMobile, setIsMobile] = useState(false);
	const pathname = usePathname();

	// Filter menu items based on admin status
	const filteredMenuItems = SIDEBAR_LIST.filter(item => 
		!item.isAdmin || isAdmin
	);

	// Handle mobile detection
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
			// Auto-close sidebar on mobile
			if (window.innerWidth < 768) {
				setIsSidebarOpen(false);
			}
		};

		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	return (
		<>
			{/* Floating menu button to open sidebar when closed */}
			{!isSidebarOpen && (
				<button
					onClick={() => setIsSidebarOpen(true)}
					className='fixed top-4 left-4 z-[9999] p-2 rounded-lg bg-gray-800 text-white shadow-md hover:bg-gray-700 transition-colors'
					aria-label='Show sidebar'
				>
					<Menu className='w-5 h-5' />
				</button>
			)}

			<div className={`${isSidebarOpen ? 'flex' : 'block'} min-h-full bg-gray-100`}>
				{/* Mobile Sidebar Overlay */}
				{isMobile && isSidebarOpen && (
					<div
						className='fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden'
						onClick={() => setIsSidebarOpen(false)}
					/>
				)}

				{/* Sidebar */}
				{isSidebarOpen && (
					<aside
						className={`${
							isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
						} fixed md:relative z-50 w-64 md:w-64 transition-transform duration-300 ease-in-out bg-white border-r border-gray-200 min-h-full`}
					>
						<div className='flex items-center gap-2 p-4 border-b border-gray-200'>
							<h1 className='text-xl font-bold'>Dashboard</h1>
							<button
								onClick={() => setIsSidebarOpen(false)}
								className='p-2 rounded-lg hover:bg-gray-100 bg-gray-800 text-white ml-2 transition-colors'
								aria-label='Hide sidebar'
							>
								<X className='w-5 h-5' />
							</button>
						</div>
						<nav className='mt-4 overflow-y-auto h-[calc(100%-4rem)]'>
							{filteredMenuItems.map((item) => {
								const isActive =
									item.href === '/dashboard'
										? pathname === '/dashboard'
										: pathname === item.href ||
										  pathname.startsWith(item.href + '/');
								return (
									<Link
										key={item.name}
										href={item.href}
										className={`flex items-center px-4 py-3 transition-colors ${
											isActive
												? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
												: 'text-gray-700 hover:bg-gray-100'
										}`}
									>
										{item.icon}
										<span className='ml-3'>{item.name}</span>
									</Link>
								);
							})}
						</nav>
					</aside>
				)}

				{/* Mobile Menu Button (bottom right, only on mobile when closed) */}
				{isMobile && !isSidebarOpen && (
					<button
						onClick={() => setIsSidebarOpen(true)}
						className='fixed bottom-4 right-4 md:hidden z-50 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors'
					>
						<Menu className='w-6 h-6' />
					</button>
				)}

				{/* Main Content */}
				<main
					className={`transition-all duration-300 min-h-full bg-gray-100 ${
						isSidebarOpen 
							? 'p-4 md:p-8 md:ml-4 max-w-6xl' 
							: 'w-full p-2'
					}`}
					style={!isSidebarOpen ? { maxWidth: '100vw' } : {}}
				>
					{children}
				</main>
			</div>
		</>
	);
}