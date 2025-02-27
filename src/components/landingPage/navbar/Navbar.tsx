import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold">
             <Image src="/LOGO_V1.png" alt="logo" width={100} height={100} />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {[
                { href: '/', label: 'Home' },
                // { href: '/about', label: 'About' },
                { href: '/login', label: 'SignIn' },
                { href: '/signUp', label: 'SignUp' }
              ].map((link, index) => (
                <motion.div
                  key={link.href}

                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
