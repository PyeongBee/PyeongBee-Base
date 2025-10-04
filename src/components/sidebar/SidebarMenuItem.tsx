import React from "react";
import Link from "next/link";
import { MenuItem } from "../../types";
import { cn } from "../../styles/components";

interface SidebarMenuItemProps {
  item: MenuItem;
  isCollapsed: boolean;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({ item, isCollapsed }) => {
  const IconComponent = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center rounded-lg transition-all duration-200",
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
    </Link>
  );
};

export default SidebarMenuItem;
