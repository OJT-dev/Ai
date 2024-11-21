import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MessageSquare, Phone, Home, Settings } from 'lucide-react';

const Navigation: React.FC = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  const navItems = [
    { href: '/home', icon: Home, label: 'Home' },
    { href: '/chat', icon: MessageSquare, label: 'Chat' },
    { href: '/call', icon: Phone, label: 'Call' },
    { href: '/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <nav 
      className="bg-gray-800 px-4 py-2 fixed bottom-0 left-0 right-0 z-50"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-screen-xl mx-auto flex justify-around items-center">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = currentPath === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors
                ${isActive 
                  ? 'text-blue-400 bg-gray-700' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              aria-current={isActive ? 'page' : undefined}
              aria-label={label}
              role="link"
              tabIndex={0}
            >
              <Icon className="w-6 h-6" aria-hidden="true" />
              <span className="text-xs mt-1">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
