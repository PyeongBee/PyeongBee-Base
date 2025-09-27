'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Share2, 
  User, 
  MoreHorizontal
} from 'lucide-react';
import { LONG_PRESS_DURATION } from '../constants/editor';

export default function MobileNavigation() {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  const menuItems = [
    { icon: FileText, label: '자소서 에디터', href: '/editor' },
    { icon: Share2, label: '프로젝트 공유', href: '/share' },
    { icon: User, label: '프로필', href: '/profile' },
    { icon: MoreHorizontal, label: '더 보기', href: '/more' },
  ];

  const handleMouseEnter = (index: number) => {
    setHoveredItem(index);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const handleTouchStart = (index: number) => {
    const timer = setTimeout(() => {
      setHoveredItem(index);
    }, LONG_PRESS_DURATION); // 0.5초 후 툴팁 표시
    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    // 터치 종료 시 툴팁을 잠시 유지
    setTimeout(() => {
      setHoveredItem(null);
    }, 1000);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 md:hidden z-50 shadow-lg">
      <nav className="flex justify-around py-3">
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div key={index} className="relative">
              <Link
                href={item.href}
                className="flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105 active:scale-95"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                onTouchStart={() => handleTouchStart(index)}
                onTouchEnd={handleTouchEnd}
              >
                <IconComponent className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </Link>
              
              {/* 툴팁 */}
              {hoveredItem === index && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap z-10">
                  {item.label}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
