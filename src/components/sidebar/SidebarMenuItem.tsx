import React from "react";
import Link from "next/link";
import { MenuItem } from "../../types";
import { SIZES, ANIMATION } from "../../constants";

interface SidebarMenuItemProps {
  item: MenuItem;
  isCollapsed: boolean;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({ item, isCollapsed }) => {
  const IconComponent = item.icon;

  return (
    <Link
      href={item.href}
      className={`flex items-center rounded-lg ${ANIMATION.TRANSITION_ALL} ${ANIMATION.DURATION_200} hover:bg-gray-100 dark:hover:bg-gray-800 ${ANIMATION.HOVER_SCALE} sidebar-menu-item ${
        isCollapsed ? "justify-center h-10 px-2" : "h-10 px-3"
      }`}
      title={isCollapsed ? item.label : undefined}
    >
      <div className={`flex items-center justify-center ${SIZES.ICON_MEDIUM} flex-shrink-0`}>
        <IconComponent className={`${SIZES.ICON_MEDIUM} text-gray-600 dark:text-gray-400`} />
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
