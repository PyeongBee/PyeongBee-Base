"use client";

import React from "react";
import { SidebarProps } from "../types";
import { MENU_ITEMS, SIDEBAR, ANIMATION } from "../constants";
import SidebarLogo from "./sidebar/SidebarLogo";
import SidebarMenuItem from "./sidebar/SidebarMenuItem";
import SidebarToggle from "./sidebar/SidebarToggle";

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {

  return (
    <div
      className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 ${ANIMATION.TRANSITION_ALL} ${SIDEBAR.TRANSITION_DURATION} relative h-full flex flex-col ${
        isCollapsed ? SIDEBAR.COLLAPSED_WIDTH : SIDEBAR.EXPANDED_WIDTH
      }`}
    >
      <div className="border-b border-gray-200 dark:border-gray-700 sidebar-logo py-1 px-2">
        <SidebarLogo isCollapsed={isCollapsed} />
      </div>

      <nav className={`flex-1 space-y-1 sidebar-nav ${isCollapsed ? "p-3 collapsed" : "p-3"}`}>
        {MENU_ITEMS.map((item, index) => (
          <SidebarMenuItem key={index} item={item} isCollapsed={isCollapsed} />
        ))}
      </nav>

      <SidebarToggle isCollapsed={isCollapsed} onToggle={onToggle} />
    </div>
  );
};

export default Sidebar;
