'use client';

import { 
  FileText, 
  Share2, 
  User, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const menuItems = [
    { icon: FileText, label: '자소서 에디터', href: '/editor' },
    { icon: Share2, label: '프로젝트 공유', href: '/share' },
    { icon: User, label: '프로필', href: '/profile' },
    { icon: MoreHorizontal, label: '더 보기', href: '/more' },
  ];

  return (
    <div className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 relative h-full flex flex-col ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* 로고 영역 */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center">
          {!isCollapsed ? (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">PyeongBee-Base</span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
          )}
        </div>
      </div>

      {/* 메뉴 영역 */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <a
              key={index}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105 ${
                isCollapsed ? 'justify-center' : 'space-x-3'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <IconComponent className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
              {!isCollapsed && (
                <span className="text-gray-700 dark:text-gray-300 whitespace-nowrap">{item.label}</span>
              )}
            </a>
          );
        })}
      </nav>

      {/* 접기/펼치기 버튼 */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 z-10">
        <button
          onClick={onToggle}
          className="w-8 h-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          )}
        </button>
      </div>
    </div>
  );
}
