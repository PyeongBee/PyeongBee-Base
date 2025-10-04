"use client";

import React, { useState, useRef, useEffect } from "react";
import { Settings, Activity, LogIn, LogOut, MoreHorizontal } from "lucide-react";
import { cn } from "../../styles/components";

interface MoreDropdownProps {
  isCollapsed: boolean;
  onNavigate?: (href: string) => void;
}

const MoreDropdown: React.FC<MoreDropdownProps> = ({ isCollapsed, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // 임시로 로그인 상태를 false로 설정 (나중에 실제 인증 상태로 연결)
  const isLoggedIn = false;

  const menuItems = [
    { icon: Activity, label: "내활동", href: "/activity" },
    { icon: Settings, label: "설정", href: "/settings" },
  ];

  const authItem = isLoggedIn
    ? { icon: LogOut, label: "로그아웃", href: "/logout" }
    : { icon: LogIn, label: "로그인", href: "/login" };

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleItemClick = (href: string) => {
    setIsOpen(false);
    if (onNavigate) {
      onNavigate(href);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div
          className={cn(
            "absolute top-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50",
            "transition-all duration-200 ease-out transform",
            "opacity-100 scale-100",
            isCollapsed ? "left-12 w-48" : "left-full ml-2 w-48"
          )}
        >
          {/* 일반 메뉴 아이템들 */}
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleItemClick(item.href)}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <item.icon className="w-4 h-4 mr-3" />
              {item.label}
            </button>
          ))}
          
          {/* 구분선 */}
          <div className="border-t border-gray-200 dark:border-gray-600 my-1" />
          
          {/* 로그인/로그아웃 메뉴 */}
          <button
            onClick={() => handleItemClick(authItem.href)}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <authItem.icon className="w-4 h-4 mr-3" />
            {authItem.label}
          </button>
        </div>
      )}
      
      {/* 더보기 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center rounded-lg transition-all duration-200 w-full text-left",
          "hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105 sidebar-menu-item",
          isCollapsed ? "justify-center h-10 px-2" : "h-10 px-3",
          isOpen && "bg-gray-100 dark:bg-gray-800"
        )}
        title={isCollapsed ? "더 보기" : undefined}
      >
        <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
          <MoreHorizontal className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </div>
        {!isCollapsed && (
          <span className="text-gray-700 dark:text-gray-300 ml-3 text-sm leading-5 truncate flex-1">
            더 보기
          </span>
        )}
      </button>
    </div>
  );
};

export default MoreDropdown;
