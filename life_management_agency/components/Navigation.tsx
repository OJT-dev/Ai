import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MessageSquare, Phone, Home, Settings } from 'lucide-react';

const Navigation: React.FC = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  return (
    <nav className="bg-gray-800 px-4 py-2 flex justify-around fixed bottom-0 left-0 right-0">
      <Link href="/home" className={currentPath === '/home' ? 'text-blue-400' : 'text-gray-400 hover:text-white'}>
        <Home className="w-6 h-6" />
      </Link>
      <Link href="/chat" className={currentPath === '/chat' ? 'text-blue-400' : 'text-gray-400 hover:text-white'}>
        <MessageSquare className="w-6 h-6" />
      </Link>
      <Link href="/call" className={currentPath === '/call' ? 'text-blue-400' : 'text-gray-400 hover:text-white'}>
        <Phone className="w-6 h-6" />
      </Link>
      <Link href="/settings" className={currentPath === '/settings' ? 'text-blue-400' : 'text-gray-400 hover:text-white'}>
        <Settings className="w-6 h-6" />
      </Link>
    </nav>
  );
};

export default Navigation;
