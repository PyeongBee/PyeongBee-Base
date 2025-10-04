import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { MenuItem } from "../../types/components";
import { cn } from "../../styles/components";
import MoreDropdown from "./MoreDropdown";

interface SidebarMenuItemProps {
  item: MenuItem;
  isCollapsed: boolean;
  onNavigate?: (href: string) => void;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({ item, isCollapsed, onNavigate }) => {
  const router = useRouter();
  const pathname = usePathname();
  const IconComponent = item.icon;

  // 더보기 메뉴인 경우 드롭다운 컴포넌트 렌더링
  if (item.label === "더 보기") {
    return <MoreDropdown isCollapsed={isCollapsed} onNavigate={onNavigate} />;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // 현재 페이지와 같은 경로면 이동하지 않음
    if (pathname === item.href) {
      return;
    }

    if (onNavigate) {
      onNavigate(item.href);
    } else {
      router.push(item.href);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center rounded-lg transition-all duration-200 w-full text-left",
        "hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105 sidebar-menu-item",
        isCollapsed ? "justify-center h-10 px-2" : "h-10 px-3"
      )}
      title={isCollapsed ? item.label : undefined}
    >
      <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
        <IconComponent className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </div>
      {!isCollapsed && (
        <span className="text-gray-700 dark:text-gray-300 ml-3 text-sm leading-5 truncate flex-1">
          {item.label}
        </span>
      )}
    </button>
  );
};

export default SidebarMenuItem;
