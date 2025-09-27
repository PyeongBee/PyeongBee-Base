'use client';

import { 
  FileText, 
  Share2, 
  User, 
  MoreHorizontal
} from 'lucide-react';

export default function MobileNavigation() {
  const menuItems = [
    { icon: FileText, label: '자소서 에디터', href: '/editor' },
    { icon: Share2, label: '프로젝트 공유', href: '/share' },
    { icon: User, label: '프로필', href: '/profile' },
    { icon: MoreHorizontal, label: '더 보기', href: '/more' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 md:hidden z-50 shadow-lg">
      <nav className="flex justify-around py-2">
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <a
              key={index}
              href={item.href}
              className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105 active:scale-95"
            >
              <IconComponent className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="text-xs text-gray-600 dark:text-gray-400">{item.label}</span>
            </a>
          );
        })}
      </nav>
    </div>
  );
}
