'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

import SIDEBAR_LIST from './SIDEBAR_LIST';

interface SidebarProps {
	children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [isMobile, setIsMobile] = useState(false);
	const pathname = usePathname();

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
			if (window.innerWidth < 768) {
				setIsSidebarOpen(false);
			} else {
				setIsSidebarOpen(true);
			}
		};
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	// Filter menu items if needed (e.g., by user role)
	const filteredMenuItems = SIDEBAR_LIST;

	return (
		<>
			{/* Floating menu button to open sidebar, always visible when sidebar is closed */}
			{!isSidebarOpen && !isMobile && (
				<button
					onClick={() => setIsSidebarOpen(true)}
					className='fixed top-4 left-4 z-[9999] p-2 rounded-lg bg-gray-800 text-white shadow-md'
					aria-label='Show sidebar'
				>
					<Menu className='w-5 h-5' />
				</button>
			)}
			<div
				className={`min-h-full bg-gray-100 ${
					isSidebarOpen && !isMobile ? 'flex' : 'block'
				}`}
			>
				{/* Mobile Sidebar Overlay */}
				{isMobile && isSidebarOpen && (
					<div
						className='fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden'
						onClick={() => setIsSidebarOpen(false)}
					/>
				)}

				{/* Sidebar: only render if open (desktop) or open (mobile) */}
				{(isSidebarOpen || isMobile) && (
					<aside
						className={`fixed md:relative z-50 w-64 md:w-64 transition-transform duration-300 ease-in-out bg-white border-r border-gray-200 min-h-full ${
							isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
						} ${isMobile ? 'md:hidden' : ''}`}
					>
						<div className='flex items-center gap-2 p-4 border-b border-gray-200'>
							<h1 className='text-xl font-bold'>Dashboard</h1>
							{isSidebarOpen && (
								<button
									onClick={() => setIsSidebarOpen(false)}
									className='p-2 rounded-lg hover:bg-gray-100 bg-gray-800 text-white ml-2'
									aria-label='Hide sidebar'
								>
									<X className='w-5 h-5' />
								</button>
							)}
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
										className={`flex items-center px-4 py-3 ${
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

				{/* Mobile Menu Button (bottom right, only on mobile) */}
				{isMobile && !isSidebarOpen && (
					<button
						onClick={() => setIsSidebarOpen(true)}
						className='fixed bottom-4 right-4 md:hidden z-50 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700'
					>
						<Menu className='w-6 h-6' />
					</button>
				)}

				{/* Main Content */}
				<main
					className={`transition-all duration-300 min-h-full bg-gray-100 ${
						isSidebarOpen && !isMobile ? 'p-4 md:p-8 md:ml-4' : 'w-full p-2'
					}`}
					style={!isSidebarOpen ? { maxWidth: '100vw' } : {}}
				>
					{children}
				</main>
			</div>
		</>
	);
};

export default Sidebar;
